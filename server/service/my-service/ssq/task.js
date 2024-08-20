import axios from "axios";
import { objSort } from "../../../utils/index.js";
import schedule from "node-schedule";
import moment from "moment";
import SsqModel from "../../../schema/Ssq.js";
import ServiceModel from "../../../schema/Service.js";
import { SEND_URL } from "../../../config/index.js";
import { FORNT_END_PORT, SERVER_IP } from "../../../../config.js";

const redAllArr = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
];
const blueAllArr = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
];
let job = null;

function getData(cookie) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice",
        {
          headers: {
            cookie,
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
          },
          params: {
            name: "ssq",
            issueCount: "",
            issueStart: "",
            issueEnd: "",
            dayStart: "",
            dayEnd: "",
            pageNo: 1,
            pageSize: 200,
            week: "",
            systemType: "PC",
          },
        }
      )
      .then((res) => {
        const result = res.data?.result || [];
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function handleData(result) {
  const ssqData = result.map((item) => {
    return {
      red: item.red.split(","),
      blue: item.blue,
    };
  });

  const redObj = {};
  for (let i = 0; i < redAllArr.length; i++) {
    for (let j = 0; j < ssqData.length; j++) {
      if (ssqData[j].red.includes(redAllArr[i])) {
        redObj[redAllArr[i]] = j;
        break;
      }
    }
  }

  const blueObj = {};
  for (let i = 0; i < blueAllArr.length; i++) {
    for (let j = 0; j < ssqData.length; j++) {
      if (ssqData[j].blue === blueAllArr[i]) {
        blueObj[blueAllArr[i]] = j;
        break;
      }
    }
  }
  const sortRed = objSort(redObj);
  const sortBlue = objSort(blueObj);

  const recommend = [
    sortRed[0][0],
    sortRed[1][0],
    sortRed[2][0],
    sortRed[3][0],
    sortRed[4][0],
    sortRed[5][0],
    "|",
    sortBlue[0][0],
  ];

  return {
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("HH:mm:ss"),
    recommend: recommend.join(" "),
    red: JSON.stringify(sortRed),
    blue: JSON.stringify(sortBlue),
  };
}

const ssqTask = {
  scheduleTask(id, cookie) {
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [2, 4, 7];
    rule.hour = 18;
    rule.minute = 0;
    rule.second = 0;
    job = schedule.scheduleJob(rule, async () => {
      getData(cookie)
        .then(async (result) => {
          const data = handleData(result);
          await SsqModel.create(data);
          await ServiceModel.findOneAndUpdate({ id }, { status: true });
          axios.post(SEND_URL, {
            title: `双色球推荐`,
            desp: `http://${SERVER_IP}:${FORNT_END_PORT}/#/ssq/detail?date=${moment().format(
              "YYYY-MM-DD"
            )}`,
          });
        })
        .catch((err) => {
          console.log(err);
          axios.post(SEND_URL, {
            title: `双色球cookies已失效`,
            desp: `http://${SERVER_IP}:${FORNT_END_PORT}`,
          });
          ssqTask.stop({ id });
        });
    });
  },
  start({ id, token }) {
    return new Promise((resolve) => {
      getData(token)
        .then((res) => {
          ssqTask.scheduleTask(id, token);
          axios.post(SEND_URL, {
            title: `恭喜-双色球推荐服务已启动`,
          });
          resolve("start");
        })
        .catch((err) => {
          console.log(err, "双色球推荐服务启动失败");
          resolve({
            code: -1,
            message: "Token 错误",
          });
        });
    });
  },
  stop({ id }) {
    return new Promise(async (resolve, reject) => {
      // 更新服务状态
      await ServiceModel.findOneAndUpdate({ id }, { status: false });
      job?.cancel();
      resolve("stop");
    });
  },
};

export default ssqTask;
