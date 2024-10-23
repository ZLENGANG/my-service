<template>
  <n-data-table
    remote
    :columns="columns"
    :data="data"
    :pagination="pagination"
  />
</template>

<script setup>
import { getWinWinList } from "@/api/service";
import { NDataTable } from "naive-ui";
import { reactive, ref, h } from "vue";

const columns = ref([
  {
    title: "序号",
    width: 80,
    align: "center",
    render: (text, record, index) => {
      return record + 1;
    },
  },
  { title: "名称", key: "name" },
  { title: "名称ID", key: "type" },
  { title: "游戏", key: "game" },
  { title: "结果", key: "contents" },
  { title: "出现次数", key: "count" },
  { title: "日期", key: "date" },
  { title: "时间", key: "time" },
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
  getWinWinList({
    page: pagination.page,
    size: pagination.pageSize,
  }).then((res) => {
    data.value = res.list;
    pagination.itemCount = res.total;
  });
};

getData();
</script>
