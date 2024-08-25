import axios from "axios";
import { objSort } from "../../../utils/index.js";
import schedule from "node-schedule";
import moment from "moment";
import SsqModel from "../../../schema/Ssq.js";
import ServiceModel from "../../../schema/Service.js";
import { SEND_URL } from "../../../config/index.js";
import { FORNT_END_PORT, SERVER_IP } from "../../../../config.js";
import { load } from "cheerio";
import superagent from "superagent";
import SsqDataModel from "../../../schema/SsqData.js";

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

function getData() {
  return new Promise((resolve, reject) => {
    superagent
      .get("https://www.cjcp.cn/kaijiang/ssq/")
      .end(async (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        const $ = load(res.text, { decodeEntities: false });

        // 开奖结果
        const numResArr = [];
        $(".num_div")[0].children.forEach((item) => {
          const data = item.children?.[0]?.data;
          if (data) {
            numResArr.push(data);
          }
        });

        const obj = {
          date: $(".num_tab  tr:nth-child(2)  td  i:nth-child(1) > em")
            .text()
            .substr(0, 10),
          code: $(".kj_data > span").text().substr(0, 7),
          red: numResArr.slice(0, 6).join(","),
          blue: numResArr[numResArr.length - 1],
        };

        await SsqDataModel.create(obj);
        const result = await SsqDataModel.find()
          .sort({
            date: -1,
          })
          .limit(1000)
          .skip(0);
        resolve(result || []);
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
  scheduleTask(id) {
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [2, 4, 0];
    rule.hour = 18;
    rule.minute = 0;
    rule.second = 0;
    job = schedule.scheduleJob(rule, async () => {
      getData()
        .then(async (result) => {
          const data = handleData(result);
          await SsqModel.create(data);
          axios.post(SEND_URL, {
            title: `双色球推荐`,
            desp: `http://${SERVER_IP}:${FORNT_END_PORT}/#/ssq`,
          });
        })
        .catch((err) => {
          console.log(err);
          axios.post(SEND_URL, {
            title: `双色球爬取数据失败`,
            desp: `http://${SERVER_IP}:${FORNT_END_PORT}`,
          });
          ssqTask.stop({ id });
        });
    });
  },
  start({ id }) {
    return new Promise(async (resolve) => {
      ssqTask.scheduleTask(id);
      await ServiceModel.findOneAndUpdate({ id }, { status: true });
      axios.post(SEND_URL, {
        title: `恭喜-双色球推荐服务已启动`,
      });
      resolve("start");
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
