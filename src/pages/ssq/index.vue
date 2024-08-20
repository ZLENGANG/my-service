<template>
  <div class="container">
    <n-data-table
      remote
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :paginate-single-page="false"
    />
  </div>

  <n-modal
    v-model:show="isShowDetailModal"
    preset="dialog"
    title="Dialog"
    :showIcon="false"
    :mask-closable="false"
    style="width: 600px"
  >
    <template #header>
      <div>推荐：{{ recommendStr }}</div>
    </template>
    <div class="flex-center">
      <div>
        <h2>红球</h2>
        <div v-for="(item, index) in redArr" :key="index">
          <span>号码：</span>
          <span class="num">{{ item[0] }}</span>
          <span>已经连续</span>
          <span class="period">{{ item[1] }}</span>
          <span>期未出现</span>
        </div>
      </div>

      <div class="blue">
        <h2>蓝球</h2>
        <div v-for="(item, index) in blueArr" :key="index">
          <span>号码：</span>
          <span class="num">{{ item[0] }}</span>
          <span>已经连续</span>
          <span class="period">{{ item[1] }}</span>
          <span>期未出现</span>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import { getSsqList } from "@/api/service";
import { NDataTable, NButton, NModal } from "naive-ui";
import { reactive, ref, h } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isShowDetailModal = ref(false);
const redArr = ref([]);
const blueArr = ref([]);
const recommendStr = ref("");

const columns = ref([
  {
    title: "序号",
    width: 55,
    align: "center",
    render: (text, record, index) => {
      return record + 1;
    },
  },
  { title: "推荐", key: "recommend", width: 180 },
  { title: "日期", key: "date", width: 120 },
  { title: "时间", key: "time", width: 120 },
  {
    title: "红球号码连续未出现次数",
    key: "red",
    ellipsis: {
      "line-clamp": 1,
    },
  },
  {
    title: "蓝球号码连续未出现次数",
    key: "blue",
    ellipsis: {
      "line-clamp": 1,
    },
  },
  {
    title: "操作",
    key: "detail",
    width: 60,
    fixed: "right",
    render: (row, record, index) => {
      return h(
        NButton,
        {
          text: true,
          type: "primary",
          onClick: () => {
            redArr.value = JSON.parse(row.red);
            blueArr.value = JSON.parse(row.blue);
            recommendStr.value = row.recommend;
            isShowDetailModal.value = true;
          },
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
  getSsqList({
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

.flex-center {
  display: flex;
  justify-content: space-between;
}

.period {
  color: red;
  margin: 0 5px;
}

.num {
  color: red;
  margin: 0 5px;
}

.blue .num {
  color: blue;
  margin: 0 5px;
}

.blue .period {
  color: blue;
  margin: 0 5px;
}

</style>
