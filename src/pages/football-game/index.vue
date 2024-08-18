<template>
  <div class="container">
    <n-button type="primary" @click="jump">俱乐部维护</n-button>
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
import { getFootballGameList } from "@/api/service";
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
          href: `#/football-game/detail?date=${row.date}`,
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
  getFootballGameList({
    page: pagination.page,
    size: pagination.pageSize,
  }).then((res) => {
    data.value = res.list;
    pagination.itemCount = res.total;
  });
};

const jump = () => {
  router.push("/football-game/clubs");
};

getData();
</script>

<style scoped>
.container {
  margin: 20px;
}
</style>
