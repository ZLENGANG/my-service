import superagent from "superagent";
import { load } from "cheerio";

// function getLeaguesCurGames(info) {
//   const { code, name } = info;
//   return new Promise(async (resolve, reject) => {
//     superagent
//       .get(`https://data.qtx.com/jifenbang/${code}.html`)
//       .end(async (_err, res) => {
//         if (_err) {
//           console.log("getLeaguesTotalGames error!", name);
//           resolve({
//             avgGames: 0,
//             totalGames: 0,
//             teamsTotal: 0,
//           });
//           return;
//         }
//         const $ = load(res.text, { decodeEntities: false });
//         const trDoms = $(
//           "#whole_rank > table.total_data > tbody >tr.tc_score_value"
//         );
//         const curSessionDoms = $(
//           "#whole_rank > table.total_data > tbody >tr >.tc_schedule_td3"
//         );

//         const teamsTotal = trDoms ? trDoms.length : 0;

//         let sum = 0;
//         for (let i = 0; i < curSessionDoms.length; i++) {
//           if (i > 1) {
//             sum += Number($(curSessionDoms[i]).text());
//           }
//         }

//         const leaguesTotalGames = teamsTotal ? 2 * teamsTotal - 2 : 0;
//         const avgGames = sum / teamsTotal || 0;
//         resolve({
//           avgGames,
//           totalGames: leaguesTotalGames,
//           teamsTotal,
//         });
//       });
//   });
// }

export function getLeaguesTotalClub(info) {
  const { leaguesName, leaguesCode } = info;
  return new Promise(async (resolve, reject) => {
    superagent
      .get(`https://data.qtx.com/jifenbang/${leaguesCode}.html`)
      .end(async (_err, res) => {
        if (_err) {
          console.log("getLeaguesTotalClub error!", leaguesName);
          resolve({
            ...info,
            leaguesClubTotal: 0,
            leaguesAverageScore: 0,
            leaguesMedianScore: 0,
            leaguesScoreArr: "",
          });
          return;
        }
        const $ = load(res.text, { decodeEntities: false });
        const trDoms = $(
          "#whole_rank > table.total_data > tbody >tr.tc_score_value"
        );
        const curScoreDoms = $(
          "#whole_rank > table.total_data > tbody >tr >.tc_schedule_td12"
        );
        const teamsTotal = trDoms ? trDoms.length : 0;

        const scoreArr = [];
        for (let i = 0; i < curScoreDoms.length; i++) {
          if (i > 1) {
            scoreArr.push(Number($(curScoreDoms[i]).text()));
          }
        }

        // 计算平均数
        const average =
          scoreArr.reduce((sum, value) => sum + value, 0) / scoreArr.length;

        // 计算中位数
        scoreArr.sort((a, b) => a - b);
        const midIndex = Math.floor(scoreArr.length / 2);
        const median =
          scoreArr.length % 2 !== 0
            ? scoreArr[midIndex]
            : (scoreArr[midIndex - 1] + scoreArr[midIndex]) / 2;

        resolve({
          ...info,
          leaguesClubTotal: teamsTotal,
          leaguesAverageScore: average,
          leaguesMedianScore: median,
          leaguesScoreArr: scoreArr.join(","),
        });
      });
  });
}

export function getLeaguesTotalGames(info) {
  const { code, name } = info;
  return new Promise(async (resolve, reject) => {
    superagent
      .get(`https://data.qtx.com/saicheng/${code}.html`)
      .end(async (_err, res) => {
        let avgGames = 0;
        let totalGames = 0;
        if (_err) {
          console.log("getLeaguesTotalGames error!", name);
          resolve({
            avgGames: 0,
            totalGames: 0,
            ...info,
          });
          return;
        }
        const $ = load(res.text, { decodeEntities: false });

        if ($("#round_list .round_list").length > 0) {
          totalGames = $("#round_list > div:nth-child(1) > div").children()
            .length;
          avgGames = totalGames;
        } else {
          totalGames = $("#round_list").children().length;
          avgGames = Number($("#round_list .date_choose").text());
        }

        resolve({
          avgGames,
          totalGames,
          ...info,
        });
      });
  });
}

export function getAllLeaguesTotalGames(list) {
  return new Promise((resolve) => {
    let pArr = [];
    for (let i = 0; i < list.length; i++) {
      pArr.push(getLeaguesTotalGames(list[i]));
    }

    Promise.all(pArr).then((res) => {
      resolve(res);
    });
  });
}

export function getAllLeaguesTotalClub(list) {
  return new Promise((resolve) => {
    let pArr = [];
    for (let i = 0; i < list.length; i++) {
      pArr.push(getLeaguesTotalClub(list[i]));
    }

    Promise.all(pArr).then((res) => {
      resolve(res);
    });
  });
}

// getLeaguesTotalClub({
//   code: "LzaWpeD7wl_BgjmL5Y7bR",
//   name: "斯亚甲",
// }).then((res) => {
//   console.log(res, "zlzl");
// });
