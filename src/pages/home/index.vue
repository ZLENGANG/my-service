<template>
  <n-data-table
    remote
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :paginate-single-page="false"
  />
</template>

<script setup>
import { getServiceList, changeServiceStatusById } from "@/api/service";
import { NDataTable, NSwitch, NButton, useMessage, useDialog } from "naive-ui";
import { reactive, ref, h } from "vue";
import { NEED_TOKEN_ID_ARR } from "../../../config.js";

const message = useMessage();
const dialog = useDialog();
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
  { title: "名称ID", key: "id" },
  {
    title: "状态",
    key: "status",
    render: (row, record, index) => {
      return h(
        NSwitch,
        {
          value: row.status,
          onUpdateValue: (value) => {
            handleChangeStatus(row, value);
          },
        },
        {
          checked: () => "运行中",
          unchecked: () => "已停止",
        }
      );
    },
  },
  {
    title: "详情",
    key: "detail",
    render(row) {
      return h(
        NButton,
        {
          text: true,
          tag: "a",
          href: `#/${row.id}`,
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
  getServiceList({
    page: pagination.page,
    size: pagination.pageSize,
  }).then((res) => {
    data.value = res.list;
    pagination.itemCount = res.total;
  });
};

const handleChangeStatus = (row, status) => {
  let token = null;
  if (NEED_TOKEN_ID_ARR.includes(row.id) && status) {
    token = window.prompt("请输入token");
  }
  changeServiceStatusById({ id: row.id, status, token }).then((res) => {
    if (res.code === -1) {
      const errorMap = {
        // ssq: {
        //   tokenUrl: "https://www.cwl.gov.cn/ygkj/wqkjgg/ssq/",
        // },
        winwin: {
          tokenUrl:
            "https://www.mgvip18.com/mobile2/#/pages/tabBarPages/live/index",
        },
      }[row.id];

      dialog.info({
        title: "提示",
        content: errorMap.content || "请先配置正确的token",
        positiveText: "确定",
        onPositiveClick: () => {
          window.open(errorMap.tokenUrl);
        },
      });

      return;
    }
    row.status = !row.status;
  });
};

getData();
</script>
