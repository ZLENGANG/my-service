<template>
  <div class="container">
    <h1>今日比赛</h1>
    <n-data-table :columns="columns" :data="data" striped />
  </div>

  <n-modal
    v-model:show="isShowIFrameDialog"
    :mask-closable="false"
    :show-icon="false"
    preset="dialog"
    title="比赛详情"
  >
    <span>即时赔率：{{ tips }}</span>
    <iframe :src="iframeSrc"></iframe>
  </n-modal>
</template>

<script setup>
import { useRoute } from "vue-router";
import moment from "moment";
import {
  getFootballGameDetailByDate,
  getFootballGameRate,
} from "@/api/service";
import { ref, h } from "vue";
import { NDataTable, NModal } from "naive-ui";

const isShowIFrameDialog = ref(false);
const iframeSrc = ref("");

const columns = [
  {
    title: "时间",
    key: "startTime",
  },
  {
    title: "赛事",
    key: "round",
  },
  {
    title: "赔率",
    key: "rate",
    render(row) {
      return h(
        "span",
        {},
        `主${row.rate[0]}--和${row.rate[1]}--客${row.rate[2]}`
      );
    },
  },
  {
    title: "比赛",
    key: "game",
    render(row) {
      return h(
        "a",
        {
          href: row.href,
          onClick: (e) => {
            e.preventDefault();
            tips.value = `主${row.rate[0]}--和${row.rate[1]}--客${row.rate[2]}`;
            getFootballGameRate(row.href.split("/")[4].split(".")[0]).then(
              (res) => {
                if (res.data.length) {
                  const data = res.data;
                  tips.value = `主${data[0]}--和${data[1]}--客${data[2]}`;
                }
              }
            );
            iframeSrc.value = row.href;
            isShowIFrameDialog.value = true;
          },
        },
        `${row.teamA} vs ${row.teamB}`
      );
    },
  },
];
const route = useRoute();
const date = route.query.date || moment().format("YYYY-MM-DD");
const data = ref([]);
const tips = ref("");

getFootballGameDetailByDate({ date }).then((res) => {
  const game = JSON.parse(res.data?.game || "[]");
  console.log(game);
  data.value = game;
});
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
</style>
