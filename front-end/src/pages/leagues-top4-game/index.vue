<template>
  <div class="container">
    <div style="margin-bottom: 10px;">
      <n-button type="primary" @click="jump" style="margin-right: 10px"
        >联赛维护</n-button
      >
      <n-button
        type="primary"
        @click="router.push('/leagues-top4-game/summary')"
        >统计</n-button
      >
    </div>
    <n-data-table
      remote
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :paginate-single-page="false"
    />
  </div>
</template>

<script setup>
import { getLeaguesTop4GameList } from "@/api/service";
import { NDataTable, NButton } from "naive-ui";
import { reactive, ref, h } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const columns = ref([
  {
    title: "序号",
    width: 80,
    align: "center",
    render: (text, record, index) => {
      return record + 1;
    },
  },
  { title: "日期", key: "date", width: 120 },
  {
    title: "当日比赛",
    key: "game",
    ellipsis: {
      "line-clamp": 5,
    },
    render(row) {
      const gameArr = JSON.parse(row.game);
      let str = "";
      gameArr.forEach((item, index) => {
        str += `${item.leagueName} ${item.startTime} ${item.teamA} ${
          item.teamB
        } ${item.rate.join(" | ")}`;
        if (index !== gameArr.length - 1) {
          str += "\n";
        }
      });
      return h(
        "span",
        {
          style: {
            "white-space": "pre-line",
          },
        },
        str
      );
    },
  },
  {
    title: "详情",
    key: "detail",
    width: 100,
    render: (row, record, index) => {
      return h(
        NButton,
        {
          text: true,
          tag: "a",
          href: `#/leagues-top4-game/detail?date=${row.date}`,
          target: "_blank",
          type: "primary",
        },
        { default: () => "详情" }
      );
    },
  },
]);
const data = ref([]);

const pagination = reactive({
  trigger: "click",
  placement: "bottom",
  showQuickJumper: true,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
  itemCount: 0,
  pageSize: 10,
  page: 1,
  prefix: () => {
    //分页前缀
    return "共 " + pagination.itemCount + " 项";
  },
  onChange(page) {
    pagination.page = page;
    getData();
  },
  onPageSizeChange: (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    getData();
  },
});

const getData = () => {
  getLeaguesTop4GameList({
    page: pagination.page,
    size: pagination.pageSize,
  }).then((res) => {
    data.value = res.list;
    pagination.itemCount = res.total;
  });
};

const jump = () => {
  router.push("/leagues-top4-game/leagues");
};

getData();
</script>

<style scoped>
.container {
  margin: 20px;
}
</style>
