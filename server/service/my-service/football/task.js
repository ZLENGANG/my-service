import schedule from "node-schedule";
import axios from "axios";
import superagent from "superagent";
import { load } from "cheerio";
import moment from "moment";
import { SEND_URL } from "../../../config/index.js";
import ClubModel from "../../../schema/Club.js";
import ServiceModel from "../../../schema/Service.js";
import FootballGameModel from "../../../schema/FootballGame.js";
import { FORNT_END_PORT, SERVER_IP } from "../../../../config.js";

let todayGameArr = [];
let job = null;

const getRate = (code) => {
  return new Promise((resolve) => {
    superagent
      .get(`https://live.qtx.com/shengfu/${code}.html`)
      .end((_err, res) => {
        if (!_err) {
          const $ = load(res.text, { decodeEntities: false });
          const pubilcPath =
            "body > div.bf-main > div > div.bf-dxq > table.bf-sub-data > tbody > tr:nth-child(2)";
          const one = $(`${pubilcPath} >td:nth-child(2) > span`).text();
          const two = $(`${pubilcPath} >td:nth-child(3) > span`).text();
          const three = $(`${pubilcPath} >td:nth-child(4) > span`).text();

          resolve([one, two, three]);
        } else {
          resolve([]);
        }
      });
  });
};
const getTodayGameData = (url, club) => {
  return new Promise((resolve) => {
    superagent.get(url).end(async (_err, res) => {
      if (_err) {
        console.log("getTodayGameData error!", club);
        resolve(null);
        return;
      }
      const $ = load(res.text, { decodeEntities: false });
      const firstTrSelector =
        ".game_wrapper .first_part .future_competition > tbody:nth-child(1) > tr:nth-child(3)";
      const firstTrDom = $(firstTrSelector);
      const tempArr = [];
      const childrenArr = firstTrDom[0].children;
      childrenArr.forEach((item) => {
        tempArr.push($(item).text().trim());
      });
      const filterArr = tempArr.filter((item) => item && item !== "-");
      const href = $(`${firstTrSelector}> td.tc_schedule_td6 > a`).attr("href");

      const arr = [
        {
          round: filterArr[0],
          startTime: filterArr[1],
          teamA: filterArr[2],
          teamB: filterArr[3],
          href,
        },
      ];

      const findObj = arr.find((item) => {
        const timeStamp = new Date(`${item.startTime}`).getTime();
        const subtract = timeStamp - new Date().getTime();
        return subtract > 0 && subtract <= 15 * 1000 * 60 * 60;
      });
      if (findObj) {
        try {
          const code = findObj.href.split("/")[4].split(".")[0];
          const rate = await getRate(code);
          findObj.rate = rate;
          resolve(findObj);
        } catch (error) {
          resolve(findObj);
        }
      } else {
        resolve(null);
      }
    });
  });
};

const footballTask = {
  async scheduleTask(id) {
    let rule = new schedule.RecurrenceRule();
    rule.hour = 17;
    rule.minute = 0;
    rule.second = 0;

    job = schedule.scheduleJob(rule, async () => {
      // 查找俱乐部
      const _clubs = await ClubModel.find({});
      const clubs = _clubs.filter((item) => !item.disabled);
      const pTodayGameArr = [];

      let index = 0;
      let timer = null;
      timer = setInterval(() => {
        const url = `https://data.qtx.com/qiudui/${clubs[index].id}.html`;
        pTodayGameArr.push(getTodayGameData(url, clubs[index].club));
        index++;

        if (index === clubs.length) {
          clearInterval(timer);
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(timer);
        Promise.all(pTodayGameArr)
          .then((res) => {
            todayGameArr = res
              .filter((item) => item)
              .sort((a, b) => {
                return (
                  new Date(`${a.startTime}`).getTime() -
                  new Date(`${b.startTime}`).getTime()
                );
              });

            const info = {
              title: `今日比赛`,
              desp: `http://${SERVER_IP}:${FORNT_END_PORT}/#/football-game/detail?date=${moment().format(
                "YYYY-MM-DD"
              )}`,
            };

            axios.post(SEND_URL, info);
            FootballGameModel.create({
              date: moment().format("YYYY-MM-DD"),
              game: JSON.stringify(todayGameArr),
            });
          })
          .catch((err) => {
            const info = {
              title: `今日比赛发送失败`,
            };
            axios.post(SEND_URL, info).finally(() => {
              footballTask.stop({
                id,
              });
            });
          });
      }, 2200 * clubs.length);
    });
  },
  start({ id }) {
    return new Promise(async (resolve, reject) => {
      // 开启定时任务
      footballTask.scheduleTask(id);

      // 更新服务状态
      await ServiceModel.findOneAndUpdate({ id }, { status: true });

      axios.post(SEND_URL, {
        title: `恭喜-今日足球比赛监听服务已启动`,
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
  getRate,
};

export default footballTask;
