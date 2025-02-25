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

    <n-modal
      v-model:show="isShowWeekDataDialog"
      :show-icon="false"
      preset="dialog"
      :title="weekDetailTitle"
      style="width:800px"
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { NDataTable, NModal, NSwitch, NButton, NCard } from "naive-ui";
import { getLeaguesTop4GameList } from "@/api/service";
import {
  filterData,
  categoryByWeek,
  categoryByMonth,
  handleWeekData,
  handleMonthData,
  calSum,
  toPercent,
} from "./utils";
import { getDateColumns, getWeekColumns, monethColumns } from "./config";

const weekData = ref([]);
const monthData = ref([]);
const monthSum = ref(0);
const monthGameCount = ref(0);
const monthWinGameCount = ref(0);
const isShowWeekDataDialog = ref(false);
const curWeekData = ref([]);
const weekDetailTitle = ref("");
const isShowDateDetailDialog = ref(false);
const iframeSrc = ref("");
const dateDetailTitle = ref("");

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

getLeaguesTop4GameList({
  page: 1,
  size: 10000,
}).then((res) => {
  const data = filterData(res.list);
  weekData.value = handleWeekData(categoryByWeek(data));
  monthData.value = handleMonthData(categoryByMonth(data));
  monthSum.value = calSum(monthData.value, "monthSum");
  monthGameCount.value = calSum(monthData.value, "monthGameCount");
  monthWinGameCount.value = calSum(monthData.value, "monthWinGameCount");
  console.log(weekData.value, monthData.value);
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
}
iframe {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>
