import moment from "moment";
const notBuyLeagueNames = [
  "塞内超",
  "球会友谊",
  "圣马甲",
  "科特超",
  "毛里甲",
  "智利甲",
  "巴西乙",
  "冰岛超",
];
const buyLeagueNames = ["英超", "西甲", "法甲", "意甲", "德甲"];

function getRecentFiveResult(gameitem) {
  let winTeamWinCount = 0;
  let defeatTeamDefeatCount = 0;

  if (gameitem.teamALastFive) {
    const winTeamName = gameitem.winTopInfo.teamName;
    const defeatTeamName = gameitem.defeatTopInfo.teamName;
    let winTeamKey = "";
    let defeatKey = "";
    for (let key in gameitem) {
      if (gameitem[key] === winTeamName) {
        winTeamKey = key;
      }

      if (gameitem[key] === defeatTeamName) {
        defeatKey = key;
      }
    }

    winTeamWinCount = gameitem[`${winTeamKey}LastFive`].filter(
      (item) => item === "胜"
    ).length;

    defeatTeamDefeatCount = gameitem[`${defeatKey}LastFive`].filter(
      (item) => item === "负"
    ).length;
  }

  return {
    winTeamWinCount,
    defeatTeamDefeatCount,
  };
}

export function handleFilterGameItem(games) {
  return games.filter((gameitem) => {
    const rateOne = gameitem.rate[0];
    // 排除无盘的比赛
    if (rateOne === "-") {
      return false;
    }

    const leagueName = gameitem.leaguesName || gameitem.leagueName;
    const rateMin = Math.min(
      gameitem.rate[0],
      gameitem.rate[1],
      gameitem.rate[2]
    );
    const { winTopInfo, defeatTopInfo } = gameitem;

    // 前四赛季赢的比赛数量是否大于输和平的数量
    const isWinCountMoreDefeatAndDraw =
      Number(winTopInfo.winCount) >=
      Number(winTopInfo.defeatCount) + Number(winTopInfo.drawCount);

    // 倒四赛季输的比赛数量是否大于赢和平的数量
    const isDefeatCountMoreWinAndDraw =
      Number(defeatTopInfo.defeatCount) >=
      Number(defeatTopInfo.winCount) + Number(defeatTopInfo.drawCount);

    // 前4最近五场比赛赢的次数、倒4场最近五场比赛输的次数
    const { winTeamWinCount, defeatTeamDefeatCount } =
      getRecentFiveResult(gameitem);

    // 排除刚结束一个赛季的联赛
    if (notBuyLeagueNames.includes(leagueName)) {
      return false;
    }
    // 排除友谊赛
    if (gameitem.leagueName === "球会友谊") {
      return false;
    }

    // 五大联赛且大于赔率1.2的比赛
    if (rateMin > 1.2 && buyLeagueNames.includes(leagueName)) {
      return true;
    }

    // 赔率大于1.5，且前四最近五场比赛有三场是胜，且倒四最近五场比赛有三场是负
    if (
      rateMin > 1.48 &&
      isWinCountMoreDefeatAndDraw &&
      isDefeatCountMoreWinAndDraw &&
      ((winTeamWinCount && winTeamWinCount >= 3) ||
        (defeatTeamDefeatCount && defeatTeamDefeatCount >= 4))
    ) {
      return true;
    }
  });
}

export const filterData = (data) => {
  data.forEach((item) => {
    const games = JSON.parse(item.game);
    const filterGame = handleFilterGameItem(games);
    item.game = filterGame;
    let dateSummary = 0;
    filterGame.forEach((dateitem) => {
      dateSummary += Number(dateitem.result);
    });
    item.gameCount = filterGame.length;
    item.winGameCount = filterGame.filter((item) => item.result > 0).length;
    item.dateSummary = dateSummary;
  });

  return data.filter((item, index) => {
    if (index === 0) {
      return false;
    }

    if (index === 1) {
      const specifiedTime = moment(
        `${moment(item.date).add(1, "days").format("YYYY-MM-DD")} 19:10:00`
      );
      const currentTime = moment();
      if (currentTime.isAfter(specifiedTime)) {
        return true;
      }
      return false;
    }

    return true;
  });
};

function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((dayOfYear + startOfYear.getDay()) / 7);
}

export const categoryByWeek = (data) => {
  const weeklyData = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const weekNumber = getWeekNumber(date);
    const key = getDateByWeek(`${year}-W${weekNumber}`);

    if (!weeklyData[key]) {
      weeklyData[key] = [];
    }
    weeklyData[key].push(item);
  });

  return weeklyData;
};

export const categoryByMonth = (data) => {
  const monthlyData = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，需要加1
    const key = `${year}-${month.toString().padStart(2, "0")}`;

    if (!monthlyData[key]) {
      monthlyData[key] = [];
    }
    monthlyData[key].push(item);
  });

  return monthlyData;
};

export const getDateByWeek = (str) => {
  const keys = str.split("-");
  const year = Number(keys[0]);
  const week = Number(keys[1].slice(1));

  // 获取指定年份和周数的第一天（周一）
  const startOfWeek = moment()
    .isoWeekYear(year)
    .isoWeek(week)
    .startOf("isoWeek");

  // 获取指定年份和周数的最后一天（周日）
  const endOfWeek = moment().isoWeekYear(year).isoWeek(week).endOf("isoWeek");

  return `${startOfWeek.format("YYYY-MM-DD")} 到 ${endOfWeek.format(
    "YYYY-MM-DD"
  )} `;
};

export const handleWeekData = (weekData) => {
  const res = [];
  for (let key in weekData) {
    let weekSum = 0;
    let weekGameCount = 0;
    let weekWinGameCount = 0;
    weekData[key].forEach((item) => {
      weekSum += item.dateSummary;
      weekGameCount += item.gameCount;
      weekWinGameCount += item.winGameCount;
    });

    res.push({
      week: key,
      weekSum,
      weekGameCount,
      weekWinGameCount,
      weekData: weekData[key],
    });
  }

  return res;
};

export const handleMonthData = (monthData) => {
  const res = [];
  for (let key in monthData) {
    let monthSum = 0;
    let monthGameCount = 0;
    let monthWinGameCount = 0;
    monthData[key].forEach((item) => {
      monthSum += item.dateSummary;
      monthGameCount += item.gameCount;
      monthWinGameCount += item.winGameCount;
    });

    res.push({
      month: key,
      monthSum,
      monthGameCount,
      monthWinGameCount,
      monthData: monthData[key],
    });
  }

  return res;
};

export const calSum = (data, key) => {
  return data.reduce((pre, cur) => {
    return pre + cur[key];
  }, 0);
};

export function toPercent(num) {
  if (!num) return "0%";
  return `${(num * 100).toFixed(2)}%`;
}
