import superagent from "superagent";
import { load } from "cheerio";
import LeaguesModel from "../../../schema/Leagues.js";
import axios from "axios";
import { SEND_URL, SERVER_ADDRESS } from "../../../config/index.js";
import moment from "moment";
import LeaguesGameModel from "../../../schema/LeaguesGame.js";
import ServiceModel from "../../../schema/Service.js";
import schedule from "node-schedule";
import { getAllLeaguesTotalClub } from "./utils.js";

let job = null;

/**从url中获取code */
function getCode(href) {
  const partArr = href.split("/");
  const code = partArr[partArr.length - 1].split(".")[0];
  return code;
}

/**判断比赛开始时间是否在当前时间的15小时范围内 */
function isInnerTime(startTime) {
  const timeStamp = new Date(`${startTime}`).getTime();
  const subtract = timeStamp - new Date().getTime();
  // return subtract > 0 && subtract <= 24 * 1000 * 60 * 60 * 3;
  return subtract >= 0 && subtract < 24 * 1000 * 60 * 60;
}

/**获取联赛赢球最多的球队和输球最多的球队，分别取前四个 */
const getWinTopAndDefeatTop = (leagueCode) => {
  return new Promise((resolve, reject) => {
    superagent
      .get(`https://data.qtx.com/jifenbang/${leagueCode}.html`)
      .end((_err, res) => {
        if (!_err) {
          try {
            const $ = load(res.text, { decodeEntities: false });
            const tBodySelector = "#whole_rank > table > tbody";
            const tBody = $(tBodySelector);
            let trDoms = tBody[0].children.filter((item) => {
              return item.type === "tag";
            });
            const jifenArr = [];

            trDoms.forEach((item, index) => {
              let teamHref = "";
              index = index + 1;
              const teamName = $(
                `${tBodySelector} > tr:nth-child(${index}) > td.tc_schedule_td2`
              )
                .text()
                .trim();

              const teamHrefDom = $(
                `${tBodySelector} > tr:nth-child(${index}) > td.tc_schedule_td2 a`
              );

              if (teamHrefDom && teamHrefDom[0]?.attribs) {
                teamHref = teamHrefDom[0]?.attribs.href;
              }

              const gameCount = $(
                `${tBodySelector} > tr:nth-child(${index}) > td.tc_schedule_td3`
              ).text();

              const winCount = $(
                `${tBodySelector} > tr:nth-child(${index}) > td.tc_schedule_td4`
              ).text();
              const drawCount = $(
                `${tBodySelector} > tr:nth-child(${index}) > td.tc_schedule_td5`
              ).text();
              const defeatCount = $(
                `${tBodySelector} > tr:nth-child(${index}) > td.tc_schedule_td6`
              ).text();

              const obj = {
                teamName,
                teamHref,
                teamCode: getCode(teamHref),
                gameCount,
                winCount,
                drawCount,
                defeatCount,
              };

              if (teamName && teamName !== "球队") {
                jifenArr.push(obj);
              }
            });

            const winTopArr = jifenArr
              .sort((a, b) => {
                return Number(b.winCount) - Number(a.winCount);
              })
              .slice(0, 4);

            const defeatTopArr = jifenArr
              .reverse()
              .sort((a, b) => {
                return Number(b.defeatCount) - Number(a.defeatCount);
              })
              .slice(0, 4);
            resolve({
              winTopArr,
              defeatTopArr,
            });
          } catch (error) {
            resolve({
              winTopArr: [],
              defeatTopArr: [],
            });
            console.log("getWinTopAndDefeatTop Error:", error);
          }
        } else {
          resolve({
            winTopArr: [],
            defeatTopArr: [],
          });
        }
      });
  });
};

/**获取最近的比赛 */
const getLatelyGame = (teamInfo) => {
  return new Promise((resolve) => {
    console.log(teamInfo.teamName, teamInfo.teamHref);
    superagent.get(teamInfo.teamHref).end(async (_err, res) => {
      if (_err) {
        console.log("getLatelyGame error!", teamInfo.teamName);
        resolve(null);
        return;
      }
      const $ = load(res.text, { decodeEntities: false });
      const firstTrSelector =
        ".game_wrapper .first_part .future_competition > tbody:nth-child(1) > tr:nth-child(3)";
      const firstTrDom = $(firstTrSelector);
      const tempArr = [];
      const childrenArr = firstTrDom[0]?.children || [];
      childrenArr.forEach((item) => {
        tempArr.push($(item).text().trim());
      });
      const filterArr = tempArr.filter((item) => item && item !== "-");
      const href = $(`${firstTrSelector}> td.tc_schedule_td6 > a`).attr("href");

      resolve({
        gameUrl: href,
        leagueName: filterArr[0],
        leaguesName: teamInfo.leaguesName,
        startTime: filterArr[1],
        teamA: filterArr[2],
        teamB: filterArr[3],
        winTopInfo: teamInfo,
        id: Math.random() * 10000000,
      });
    });
  });
};

/**获取赢球最多的球队和输球最多的球队的最近比赛 */
const getWinTopAndDefeatTopLatelyGame = (leaguesInfo) => {
  return new Promise((resolve, reject) => {
    getWinTopAndDefeatTop(leaguesInfo.code).then((res) => {
      console.log(`\n=====联赛：${leaguesInfo.name}=====`);

      const pArr = [];
      let resArr = [];
      res.winTopArr.forEach((item) => {
        const lastGame = getLatelyGame({
          ...item,
          leaguesName: leaguesInfo.name,
        });
        if (lastGame) {
          pArr.push(lastGame);
        }
      });

      Promise.all(pArr).then((allRes) => {
        allRes = allRes || [];
        res.defeatTopArr.forEach((item) => {
          const findObj = allRes.find(
            (i) =>
              (i && i.teamA === item.teamName) ||
              (i && i.teamB === item.teamName)
          );
          if (findObj) {
            resArr.push({
              ...findObj,
              defeatTopInfo: item,
              leaguesCode: leaguesInfo.code,
            });
          }
        });

        resolve(resArr);
      });
    });
  });
};

/**传入比赛信息，获取最近五场比赛结果 */
export const getLatelyFiveGameResult = (gameInfo, type) => {
  const gameCode = getCode(gameInfo.gameUrl);
  return new Promise((resolve) => {
    superagent
      .get(`https://live.qtx.com/fenxi/${gameCode}.html`)
      .end((_err, res) => {
        if (!_err) {
          const $ = load(res.text, { decodeEntities: false });
          const mainLatelyGames = [];
          const guestLatelyGames = [];
          let mainTrs = $(
            "body > div.bf-main > div > div:nth-child(13) > div.bf-data-tb > table > tbody > tr"
          );
          let guestTrs = $(
            "body > div.bf-main > div > div:nth-child(14) > div.bf-data-tb > table > tbody > tr"
          );

          if (mainTrs.length === 0) {
            mainTrs = $(
              "body > div.bf-main > div > div:nth-child(11) > div.bf-data-tb > table > tbody > tr"
            );
            guestTrs = $(
              "body > div.bf-main > div > div:nth-child(12) > div.bf-data-tb > table > tbody > tr"
            );
          }

          const mainGoalCount = $(
            "body > div.bf-main > div > div.bf-top-data > table > tbody > tr:nth-child(2) > td:nth-child(3) > div > i:nth-child(1)"
          ).text();
          const guestGoalCount = $(
            "body > div.bf-main > div > div.bf-top-data > table > tbody > tr:nth-child(2) > td:nth-child(3) > div > i:nth-child(3)"
          ).text();

          const halfScore = $(
            "body > div.bf-main > div > div.bf-top-data > table > tbody > tr:nth-child(2) > td:nth-child(3) > div > div > span"
          ).text();

          for (let i = 0; i < mainTrs.length; i++) {
            const gameName = $(mainTrs[i].children[1]).text();
            const gameResult = $(mainTrs[i].children[25]).text();
            mainLatelyGames.push({
              gameName,
              gameResult,
            });
          }

          for (let i = 0; i < guestTrs.length; i++) {
            const gameName = $(guestTrs[i].children[1]).text();
            const gameResult = $(guestTrs[i].children[25]).text();
            guestLatelyGames.push({
              gameName,
              gameResult,
            });
          }

          const leaguesName = gameInfo.leaguesName || gameInfo.leagueName;

          const filterMainArr = mainLatelyGames
            .filter((item) => item.gameName === leaguesName)
            .map((item) => item.gameResult)
            .slice(0, 5);

          const filterGuestArr = guestLatelyGames
            .filter((item) => item.gameName === leaguesName)
            .map((item) => item.gameResult)
            .slice(0, 5);

          resolve({
            ...(type
              ? {
                  ...gameInfo,
                  mainGoalCount,
                  guestGoalCount,
                  halfScore,
                }
              : {}),
            teamALastFive: filterMainArr,
            teamBLastFive: filterGuestArr,
          });
        } else {
          console.log("error", _err);
          resolve({
            teamALastFive: [],
            teamBLastFive: [],
          });
        }
      });
  });
};

/**传入比赛code获取比赛赔率 */
const getRatebyGameInfo = (gameInfo) => {
  const gameCode = getCode(gameInfo.gameUrl);
  return new Promise((resolve) => {
    superagent
      .get(`https://live.qtx.com/shengfu/${gameCode}.html`)
      .end((_err, res) => {
        if (!_err) {
          const $ = load(res.text, { decodeEntities: false });
          const pubilcPath =
            "body > div.bf-main > div > div.bf-dxq > table.bf-sub-data > tbody > tr:nth-child(2)";
          const one = $(`${pubilcPath} >td:nth-child(2) > span`).text();
          const two = $(`${pubilcPath} >td:nth-child(3) > span`).text();
          const three = $(`${pubilcPath} >td:nth-child(4) > span`).text();

          getLatelyFiveGameResult(gameInfo)
            .then((res) => {
              resolve({
                ...res,
                ...gameInfo,
                rate: [one, two, three],
              });
            })
            .catch(() => {
              resolve({
                ...gameInfo,
                rate: [one, two, three],
              });
            });

          console.log(
            `\n${gameInfo.teamA}-${gameInfo.teamB} 比赛赔率：${one}-${two}-${three}`
          );
        } else {
          resolve({
            ...gameInfo,
            rate: [],
          });
        }
      });
  });
};

const main = async () => {
  const _leaguesArr = await LeaguesModel.find({});
  const leaguesArr = _leaguesArr.filter((item) => !item.disabled);
  const pArr = [];
  leaguesArr.forEach((item) => {
    pArr.push(getWinTopAndDefeatTopLatelyGame(item));
  });
  Promise.all(pArr).then((res) => {
    const filterArr = res.flat().filter((i) => isInnerTime(i.startTime)) || [];
    const ratePArr = [];
    filterArr.forEach((item) => {
      ratePArr.push(getRatebyGameInfo(item));
    });

    Promise.all(ratePArr).then((finallyArr) => {
      getAllLeaguesTotalClub(finallyArr).then((resArr) => {
        const info = {
          title: `今日联赛前4名比赛`,
          desp: `${SERVER_ADDRESS}/#/leagues-top4-game/detail?date=${moment().format(
            "YYYY-MM-DD"
          )}`,
        };
        axios.post(SEND_URL, info);
        LeaguesGameModel.create({
          date: moment().format("YYYY-MM-DD"),
          game: JSON.stringify(resArr),
        });
      });
    });
  });
};

const leaguesTopGameTask = {
  async scheduleTask(execTime) {
    let rule = new schedule.RecurrenceRule();
    if (execTime) {
      const arr = execTime.split(":");
      rule.hour = arr[0];
      rule.minute = arr[1];
      rule.second = arr[2];
    } else {
      rule.hour = 17;
      rule.minute = 0;
      rule.second = 0;
    }

    job = schedule.scheduleJob(rule, async () => {
      main();
    });
  },
  start({ id, execTime }) {
    return new Promise(async (resolve, reject) => {
      // 开启定时任务
      leaguesTopGameTask.scheduleTask(execTime);

      // 更新服务状态
      await ServiceModel.findOneAndUpdate({ id }, { status: true, execTime });

      axios.post(SEND_URL, {
        title: `恭喜-今日联赛前四比赛监听服务已启动`,
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

export default leaguesTopGameTask;
