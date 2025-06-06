<template>
  <div class="container">
    <h1>今日比赛</h1>

    <div class="mb-10">总盈亏：{{ money }}</div>

    <div class="mb-10">
      筛选 <n-switch v-model:value="isFilter" @update:value="handleFilter" />
    </div>

    <n-button
      class="mb-10"
      :loading="loading"
      type="primary"
      :disabled="isFilter"
      @click="getLeast5GamesResult"
      >更新</n-button
    >

    <div class="mb-10">
      <n-button
        style="margin-right: 20px"
        type="primary"
        @click="handleDate('prev')"
      >
        前一天</n-button
      >

      <n-button type="primary" @click="handleDate('next')"> 后一天</n-button>
    </div>

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
  updateGameInfo,
} from "@/api/service";
import { ref, h, render, computed } from "vue";
import { NDataTable, NModal, NSwitch, NButton, NButtonGroup } from "naive-ui";
import { getLatelyFiveGameResult } from "../../api/service";
import { handleFilterGameItem } from "./summary/utils";

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
const route = useRoute();
const date = computed(() => route.query.date || moment().format("YYYY-MM-DD"));
const data = ref([]);
const tips = ref("");
let originData = [];
const id = ref("");
const loading = ref(false);
const money = ref(0);

const handleFilter = (val) => {
  getData();
};

const handleDate = (type) => {
  let jumpDate = "";
  if (type === "prev") {
    jumpDate = moment(date.value).subtract(1, "days").format("YYYY-MM-DD");
  } else {
    jumpDate = moment(date.value).add(1, "days").format("YYYY-MM-DD");
  }
  window.location.href = `#/leagues-top4-game/detail?date=${jumpDate}`;
  window.location.reload();
};

function uniqueObjectsByProperty(arr, property) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = item[property];
    return seen.has(key) ? false : seen.add(key);
  });
}

function getData() {
  money.value = 0;

  data.value = originData.sort((a, b) => {
    return new Date(a.startTime) - new Date(b.startTime);
  });

  if (isFilter.value) {
    data.value = handleFilterGameItem(originData);
  }

  data.value.forEach((item) => {
    const defeatTeamName = item.defeatTopInfo.teamName;
    const winTeamName = item.winTopInfo.teamName;
    const mainGoalCount = Number(item.mainGoalCount);
    const guestGoalCount = Number(item.guestGoalCount);

    let defeatKey = "";
    let winKey = "";

    for (let key in item) {
      if (item[key] === defeatTeamName) {
        defeatKey = key;
      }

      if (item[key] === winTeamName) {
        winKey = key;
      }
    }

    if (winKey === "teamA") {
      item.result =
        mainGoalCount > guestGoalCount
          ? ((Number(item.rate[0]) - 1) * 1000).toFixed(0)
          : -1000;
    } else {
      item.result =
        mainGoalCount < guestGoalCount
          ? ((Number(item.rate[2]) - 1) * 1000).toFixed(0)
          : -1000;
    }
    money.value += Number(item.result);
    const defeatLastFive = item[`${defeatKey}LastFive`] || [];
    item.isMore4Defeat =
      defeatLastFive.filter((item) => item === "负")?.length >= 4;
    item.score = `${mainGoalCount} : ${guestGoalCount}`;
  });

  console.log(data.value);
}

getLeaguesTop4GameDetailByDate({ date: date.value }).then(async (res) => {
  const game = JSON.parse(res.data?.game || "[]");
  id.value = res.data?._id;
  let _game = uniqueObjectsByProperty(game, "teamA");
  if (_game[0].rate) {
    // _game = _game.filter((item) => item.rate[0] !== "-");
    originData = JSON.parse(JSON.stringify(_game));

    getData();
  }
  console.log(originData);
});

const getLeast5GamesResult = async () => {
  try {
    loading.value = true;
    const res = await getLatelyFiveGameResult(originData);
    originData = res.list;
    getData();
    const game = JSON.stringify(data.value);
    await updateGameInfo({
      date: date.value,
      game,
    });
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};

// getData();
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

.mb-10 {
  margin-bottom: 10px;
}
</style>
