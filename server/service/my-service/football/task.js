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
const getTodayGameData = (url) => {
  return new Promise((resolve) => {
    superagent.get(url).end((_err, res) => {
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
      const arr = [
        {
          round: filterArr[0],
          startTime: filterArr[1],
          teamA: filterArr[2],
          teamB: filterArr[3],
          href: $(`${firstTrSelector}> td.tc_schedule_td6 > a`).attr("href"),
        },
      ];

      const findObj = arr.find((item) => {
        const timeStamp = new Date(`${item.startTime}`).getTime();
        const subtract = timeStamp - new Date().getTime();
        return subtract > 0 && subtract <= 15 * 1000 * 60 * 60;
      });
      if (findObj) {
        resolve(findObj);
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

      for (let i = 0; i < clubs.length; i++) {
        const url = `https://data.qtx.com/qiudui/${clubs[i].id}.html`;
        pTodayGameArr.push(getTodayGameData(url));
      }

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
};

export default footballTask;
