import { NDataTable, NModal, NSwitch, NButton, NCard } from "naive-ui";
import { h } from "vue";
import { toPercent } from "./utils";
export const getDateColumns = (lookMore) => {
  return [
    {
      title: "序号",
      width: 100,
      align: "center",
      render: (text, record, index) => {
        return record + 1;
      },
    },
    {
      title: "日期",
      key: "date",
    },

    {
      title: "赢场数 / 比赛数",
      key: "winGameCount",
      width: 130,
      render(row) {
        return h("span", null, {
          default: () => `${row.winGameCount} / ${row.gameCount}`,
        });
      },
    },

    {
      title: "胜率",
      key: "winGameCount",
      width: 100,
      render(row) {
        return h("span", null, {
          default: () => `${toPercent(row.winGameCount / row.gameCount)}`,
        });
      },
    },

    {
      title: "日盈亏",
      key: "dateSummary",
      width: 100,
    },

    {
      title: "操作",
      key: "actions",
      width: 100,

      render(row) {
        return h(
          NButton,
          {
            type: "info",
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => {
              lookMore && lookMore(row);
            },
          },
          { default: () => "查看" }
        );
      },
    },
  ];
};
export const getWeekColumns = (lookMore) => {
  return [
    {
      title: "序号",
      width: 100,
      align: "center",
      render: (text, record, index) => {
        return record + 1;
      },
    },
    {
      title: "日期",
      key: "week",
      width: 220,
    },

    {
      title: "赢场数 / 比赛数",
      key: "weekGameCount",
      width: 130,
      render(row) {
        return h("span", null, {
          default: () => `${row.weekWinGameCount} / ${row.weekGameCount}`,
        });
      },
    },

    {
      title: "周胜率",
      key: "weekGameCount",
      width: 100,
      render(row) {
        return h("span", null, {
          default: () =>
            `${toPercent(row.weekWinGameCount / row.weekGameCount)}`,
        });
      },
    },

    {
      title: "周盈亏",
      key: "weekSum",
      width: 100,
    },
    {
      title: "操作",
      key: "actions",
      width: 100,

      render(row) {
        return h(
          NButton,
          {
            type: "info",
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => {
              lookMore && lookMore(row);
            },
          },
          { default: () => "查看" }
        );
      },
    },
  ];
};
export const monethColumns = [
  {
    title: "序号",
    width: 100,
    align: "center",
    render: (text, record, index) => {
      return record + 1;
    },
  },
  {
    title: "月份",
    key: "month",
    width: 120,
  },

  {
    title: "赢场数 / 比赛数",
    key: "monthGameCount",
    width: 130,
    render(row) {
      return h("span", null, {
        default: () => `${row.monthWinGameCount} / ${row.monthGameCount}`,
      });
    },
  },

  {
    title: "月胜率",
    key: "monthGameCount",
    width: 100,
    render(row) {
      return h("span", null, {
        default: () =>
          `${toPercent(row.monthWinGameCount / row.monthGameCount)}`,
      });
    },
  },

  {
    title: "月盈亏",
    key: "monthSum",
    width: 100,
  },
];

export const gateLeaguesColumns = (lookMore) => {
  return [
    {
      title: "序号",
      width: 100,
      align: "center",
      render: (text, record, index) => {
        return record + 1;
      },
    },
    {
      title: "联赛code",
      key: "leaguesCode",
      width: 120,
    },
    {
      title: "联赛名",
      key: "leaguesName",
      width: 120,
    },

    {
      title: "赢场数 / 比赛数",
      key: "monthGameCount",
      width: 130,
      render(row) {
        return h("span", null, {
          default: () => `${row.winCount} / ${row.gamesTotal}`,
        });
      },
    },

    {
      title: "胜率",
      key: "monthGameCount",
      width: 100,
      render(row) {
        return h("span", null, {
          default: () => `${toPercent(row.winCount / row.gamesTotal)}`,
        });
      },
      sorter: (a, b) => {
        return a.winCount / a.gamesTotal - b.winCount / b.gamesTotal;
      },
    },

    {
      title: "盈亏",
      key: "totalMoney",
      width: 100,
      sorter: (a, b) => {
        return a.totalMoney - b.totalMoney;
      },
    },

    {
      title: "操作",
      key: "actions",
      width: 100,

      render(row) {
        return h(
          NButton,
          {
            type: "info",
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => {
              lookMore && lookMore(row);
            },
          },
          { default: () => "查看" }
        );
      },
    },
  ];
};

export const leaguesDetailColumns = [
  {
    title: "序号",
    width: 80,
    align: "center",
    render: (text, record, index) => {
      return record + 1;
    },
  },
  {
    title: "时间",
    key: "startTime",
    width: 150,
  },
  {
    title: "联赛",
    key: "leagueName",
    render(row) {
      return h(
        "a",
        {
          href: `https://data.qtx.com/jifenbang/${row.leaguesCode}.html`,
          target: "_blank",
          // onClick: (e) => {
          //   e.preventDefault();
          //   iframeSrc.value = `https://data.qtx.com/jifenbang/${row.leaguesCode}.html`;
          //   isShowIFrameDialog.value = true;
          // },
        },
        row.leagueName
      );
    },
  },
  {
    title: "赔率",
    key: "rate",
    width: 200,
    render(row) {
      return h(
        "span",
        {},
        `主${row.rate?.[0]}--和${row.rate?.[1]}--客${row.rate?.[2]}`
      );
    },
  },
  {
    title: "比赛",
    key: "game",
    width: 400,
    render(row) {
      const teamAInfo =
        row.teamA === row.winTopInfo.teamName
          ? row.winTopInfo
          : row.defeatTopInfo;

      const teamBInfo =
        row.teamB === row.winTopInfo.teamName
          ? row.winTopInfo
          : row.defeatTopInfo;
      return h(
        "a",
        {
          href: row.gameUrl,
          target: "_blank",
          style: {
            cursor: "pointer",
            "text-decoration": "underline",
            color: row.isMore4Defeat ? "red" : "",
          },
        },
        `${row.teamA}(${teamAInfo.winCount} | ${teamAInfo.drawCount} | ${
          teamAInfo.defeatCount
        }) ${row.teamALastFive ? "(" + row.teamALastFive + ")" : ""} vs
         ${row.teamB}(${teamBInfo.winCount} | ${teamBInfo.drawCount} | ${
          teamBInfo.defeatCount
        }) ${row.teamBLastFive ? "(" + row.teamBLastFive + ")" : ""}`
      );
    },
  },
  {
    title: "比分",
    key: "score",
    render(row) {
      return h("span", {}, `${row.score}`);
    },
  },
  {
    title: "盈亏",
    key: "result",
    render(row) {
      return h("span", {}, `${row.result}`);
    },
  },
];
