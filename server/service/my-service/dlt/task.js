import axios from "axios";
import { objSort } from "../../../utils/index.js";
import schedule from "node-schedule";
import moment from "moment";
import DltModel from "../../../schema/Dlt.js";
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
  "33",
  "34",
  "35",
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
];

let job = null;

const handleData = (result) => {
  const dltData = result.map((item) => {
    const data = item.lotteryDrawResult.split(" ");
    return {
      red: data.slice(0, 5),
      blue: data.slice(-2),
    };
  });

  const redObj = {};
  for (let i = 0; i < redAllArr.length; i++) {
    for (let j = 0; j < dltData.length; j++) {
      if (dltData[j].red.includes(redAllArr[i])) {
        redObj[redAllArr[i]] = j;
        break;
      }
    }
  }

  const blueObj = {};
  for (let i = 0; i < blueAllArr.length; i++) {
    for (let j = 0; j < dltData.length; j++) {
      if (dltData[j].blue.includes(blueAllArr[i])) {
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
    "|",
    sortBlue[0][0],
    sortBlue[1][0],
  ];

  return {
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("HH:mm:ss"),
    recommend: recommend.join(" "),
    red: JSON.stringify(sortRed),
    blue: JSON.stringify(sortBlue),
  };
};

function getData() {
  return new Promise((resolve) => {
    axios
      .get(
        "https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=85&provinceId=0&pageSize=200&isVerify=1&pageNo=1",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
          },
        }
      )
      .then((res) => {
        const result = res.data?.value?.list || [];
        resolve(result);
      })
      .catch(() => {});
  });
}

const dltTask = {
  scheduleTask(id) {
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [1, 3, 6];
    rule.hour = 18;
    rule.minute = 0;
    rule.second = 0;
    job = schedule.scheduleJob(rule, async () => {
      getData().then(async (result) => {
        const data = handleData(result);
        await DltModel.create(data);
        await ServiceModel.findOneAndUpdate({ id }, { status: true });
        axios.post(SEND_URL, {
          title: `大乐透推荐`,
          desp: `http://${SERVER_IP}:${FORNT_END_PORT}/#/dlt/detail?date=${moment().format(
            "YYYY-MM-DD"
          )}`,
        });
      });
    });
  },
  start({ id }) {
    return new Promise((resolve) => {
      dltTask.scheduleTask(id);
      axios.post(SEND_URL, {
        title: `恭喜-大乐透推荐服务已启动`,
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

export default dltTask;
