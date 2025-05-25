<template>
  <div class="total">
    <p>总比赛数：{{ monthGameCount }}</p>
    <p>总赢场数：{{ monthWinGameCount }}</p>
    <p>总胜率：{{ toPercent(monthWinGameCount / monthGameCount) }}</p>
    <p>总盈亏：{{ monthSum }}</p>
  </div>
  <div class="container">
    <n-card title="每周汇总" style="width: 800px">
      <n-data-table
        :columns="weekColumns"
        :data="weekData"
        striped
        max-height="500"
      />
    </n-card>

    <n-card title="月汇总" style="width: 600px">
      <n-data-table
        :columns="monethColumns"
        :data="monthData"
        striped
        max-height="500"
      />
    </n-card>

    <n-card title="联赛">
      <n-data-table
        :columns="leaguesColumns"
        :data="leaguesData"
        striped
        max-height="500"
      />
    </n-card>

    <n-modal
      v-model:show="isShowWeekDataDialog"
      :show-icon="false"
      preset="dialog"
      :title="weekDetailTitle"
      style="width: 800px"
    >
      <n-data-table
        :columns="dateColumns"
        :data="curWeekData"
        striped
        max-height="500"
      />
    </n-modal>

    <n-modal
      v-model:show="isShowDateDetailDialog"
      :show-icon="false"
      preset="dialog"
      :title="dateDetailTitle"
      style="width: 90%"
    >
      <iframe :src="iframeSrc"></iframe>
    </n-modal>

    <n-modal
      v-model:show="isShowLeaguesDetailDialog"
      :show-icon="false"
      preset="dialog"
      style="width: 1200px"
    >
      <n-data-table
        :columns="leaguesDetailColumns"
        :data="curLeaguesDetail"
        striped
        max-height="500"
      />
    </n-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { NDataTable, NModal, NSwitch, NButton, NCard } from "naive-ui";
import { getLeaguesTop4GameList, getLeaguesList } from "@/api/service";
import {
  filterData,
  categoryByWeek,
  categoryByMonth,
  handleWeekData,
  handleMonthData,
  calSum,
  toPercent,
  leaguesGames,
} from "./utils";
import {
  getDateColumns,
  getWeekColumns,
  monethColumns,
  gateLeaguesColumns,
  leaguesDetailColumns,
} from "./config";

const weekData = ref([]);
const monthData = ref([]);
const leaguesData = ref([]);
const monthSum = ref(0);
const monthGameCount = ref(0);
const monthWinGameCount = ref(0);
const isShowWeekDataDialog = ref(false);
const curWeekData = ref([]);
const weekDetailTitle = ref("");
const isShowDateDetailDialog = ref(false);
const iframeSrc = ref("");
const dateDetailTitle = ref("");
const isShowLeaguesDetailDialog = ref(false);
const curLeaguesDetail = ref([]);
const leaguesList = ref([]);

const dateColumns = getDateColumns((row) => {
  console.log(row);
  dateDetailTitle.value = `${row.date} 比赛详情`;
  iframeSrc.value = `#/leagues-top4-game/detail?date=${row.date}`;
  isShowDateDetailDialog.value = true;
});

const weekColumns = getWeekColumns((row) => {
  weekDetailTitle.value = `${row.week}，总盈亏为：${row.weekSum}`;
  curWeekData.value = row.weekData;
  isShowWeekDataDialog.value = true;
});

const leaguesColumns = gateLeaguesColumns((row) => {
  console.log(row);
  curLeaguesDetail.value = row.games;
  isShowLeaguesDetailDialog.value = true;
});

getLeaguesList({
  search: "",
  page: 1,
  size: 10000,
}).then((res1) => {
  getLeaguesTop4GameList({
    page: 1,
    size: 10000,
  }).then((res) => {
    const list = JSON.parse(JSON.stringify(res.list));
    const data = filterData(res.list, res1.list);
    weekData.value = handleWeekData(categoryByWeek(data));
    monthData.value = handleMonthData(categoryByMonth(data));
    monthSum.value = calSum(monthData.value, "monthSum");
    monthGameCount.value = calSum(monthData.value, "monthGameCount");
    monthWinGameCount.value = calSum(monthData.value, "monthWinGameCount");
    // console.log(weekData.value, monthData.value);

    leaguesData.value = leaguesGames(list);
  });
});
</script>

<style scoped>
.total {
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
}
.container {
  min-width: 1200px;
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  flex-wrap: wrap;
}
iframe {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>
