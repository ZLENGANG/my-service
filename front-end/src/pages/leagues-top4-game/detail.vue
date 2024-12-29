<template>
  <div class="container">
    <h1>今日比赛</h1>
    <div>
      每场比赛买1000元，总计投入
      <span>{{ 1000 * data.length }}</span>
      元，最多可赢
      <span>{{ (sum * 1000).toFixed(2) }}</span>
    </div>

    <div>筛选</div>
    <n-switch v-model:value="isFilter" @update:value="handleFilter" />

    <n-data-table :columns="columns" :data="data" striped />
  </div>

  <n-modal
    v-model:show="isShowIFrameDialog"
    :mask-closable="false"
    :show-icon="false"
    preset="dialog"
    title="比赛详情"
    style="width: 90%"
  >
    <span>即时赔率：{{ tips }}</span>
    <iframe :src="iframeSrc"></iframe>
  </n-modal>
</template>

<script setup>
import { useRoute } from "vue-router";
import moment from "moment";
import {
  getLeaguesTop4GameDetailByDate,
  getFootballGameRate,
} from "@/api/service";
import { ref, h, render } from "vue";
import { NDataTable, NModal, NSwitch } from "naive-ui";

const isShowIFrameDialog = ref(false);
const iframeSrc = ref("");
const isFilter = ref(false);

const columns = [
  {
    title: "序号",
    width: 50,
    align: "center",
    render: (text, record, index) => {
      return record + 1;
    },
  },
  {
    title: "时间",
    key: "startTime",
  },
  {
    title: "联赛",
    key: "leagueName",
    render(row) {
      return h(
        "a",
        {
          href: `https://data.qtx.com/jifenbang/${row.leaguesCode}.html`,
          onClick: (e) => {
            e.preventDefault();
            iframeSrc.value = `https://data.qtx.com/jifenbang/${row.leaguesCode}.html`;
            isShowIFrameDialog.value = true;
          },
        },
        row.leagueName
      );
    },
  },
  {
    title: "赔率",
    key: "rate",
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
          href: row.href,
          onClick: (e) => {
            e.preventDefault();
            tips.value = `主${row.rate?.[0]}--和${row.rate?.[1]}--客${row.rate?.[2]}`;
            getFootballGameRate(row.gameUrl.split("/")[4].split(".")[0]).then(
              (res) => {
                if (res.data.length) {
                  const data = res.data;
                  tips.value = `主${data[0]}--和${data[1]}--客${data[2]}`;
                }
              }
            );
            iframeSrc.value = row.gameUrl;
            isShowIFrameDialog.value = true;
          },
          style: {
            cursor: "pointer",
            "text-decoration": "underline",
          },
        },
        `${row.teamA}(${teamAInfo.winCount} | ${teamAInfo.drawCount} | ${teamAInfo.defeatCount}) vs
         ${row.teamB}(${teamBInfo.winCount} | ${teamBInfo.drawCount} | ${teamBInfo.defeatCount})`
      );
    },
  },
];
const route = useRoute();
const date = route.query.date || moment().format("YYYY-MM-DD");
const data = ref([]);
const tips = ref("");
let sum = ref(0);
let originData = [];

const handleFilter = (val) => {
  getData();
};

function uniqueObjectsByProperty(arr, property) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = item[property];
    return seen.has(key) ? false : seen.add(key);
  });
}

function getData() {
  sum.value = 0;
  data.value = originData
    .filter((item) => {
      const rateMin = Math.min(item.rate[0], item.rate[1], item.rate[2]);
      if (isFilter.value) {
        if (rateMin > 1.1) {
          sum.value += rateMin - 1;
          return true;
        }
      } else {
        sum.value += rateMin - 1;
        return true;
      }
    })
    .sort((a, b) => {
      return new Date(a.startTime) - new Date(b.startTime);
    });
}

getLeaguesTop4GameDetailByDate({ date }).then((res) => {
  const game = JSON.parse(res.data?.game || "[]");
  let _game = uniqueObjectsByProperty(game, "teamA");
  if (_game[0].rate) {
    _game = _game.filter((item) => item.rate[0] !== "-");
    originData = JSON.parse(JSON.stringify(_game));

    getData();
  }
});

getData();
</script>

<style scoped>
.container {
  margin: 0 auto;
  text-align: center;
}

iframe {
  width: 100%;
  height: 100vh;
  border: none;
}

td a {
  cursor: pointer;
  text-decoration: underline;
}
</style>
