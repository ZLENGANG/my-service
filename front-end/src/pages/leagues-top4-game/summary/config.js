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
          default: () =>
            `${toPercent(row.winGameCount / row.gameCount)}`,
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
