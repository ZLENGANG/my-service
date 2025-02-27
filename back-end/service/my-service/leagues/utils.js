import superagent from "superagent";
import { load } from "cheerio";

export function getLeaguesTotalGames(info) {
  const { code, name } = info;
  return new Promise(async (resolve, reject) => {
    superagent
      .get(`https://data.qtx.com/jifenbang/${code}.html`)
      .end(async (_err, res) => {
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
        const trDoms = $(
          "#whole_rank > table.total_data > tbody >tr.tc_score_value"
        );
        const curSessionDoms = $(
          "#whole_rank > table.total_data > tbody >tr >.tc_schedule_td3"
        );

        const teamsTotal = trDoms ? trDoms.length : 0;

        let sum = 0;
        for (let i = 0; i < curSessionDoms.length; i++) {
          if (i > 1) {
            sum += Number($(curSessionDoms[i]).text());
          }
        }

        const leaguesTotalGames = teamsTotal ? 2 * teamsTotal - 2 : 0;
        const avgGames = sum / teamsTotal || 0;
        resolve({
          avgGames,
          totalGames: leaguesTotalGames,
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
