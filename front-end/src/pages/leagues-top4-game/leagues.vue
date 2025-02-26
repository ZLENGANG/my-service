<template>
  <div class="container">
    <n-button type="primary" @click="isShowAddDialog = true">添加</n-button>
    <n-button
      :loading="loading"
      type="primary"
      style="margin-left: 10px"
      @click="handleUpdateAllLeagues"
      >更新联赛</n-button
    >

    <div style="margin: 10px 0">
      <n-input
        :style="{ width: '50%' }"
        v-model:value="keyword"
        @keydown.enter="getData('search')"
      />
      <n-button type="primary" @click="getData('search')"> 搜索 </n-button>
    </div>

    <n-data-table
      remote
      :columns="columns"
      :data="data"
      :pagination="pagination"
    />

    <n-modal
      v-model:show="isShowAddDialog"
      :mask-closable="false"
      :show-icon="false"
      preset="dialog"
      title="添加数据"
      positive-text="确认"
      negative-text="取消"
      :on-positive-click="save"
    >
      <n-form
        ref="formRef"
        :label-width="80"
        :model="formValue"
        :rules="rules"
        require-mark-placement="left"
      >
        <n-form-item label="联赛ID" path="code">
          <n-input v-model:value="formValue.code" placeholder="输入联赛ID" />
        </n-form-item>
        <n-form-item label="联赛名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="输入联赛名称" />
        </n-form-item>
        <n-form-item label="是否可用" path="disabled">
          <n-switch v-model:value="formValue.isActive">
            <template #checked> 启用</template>
            <template #unchecked> 禁用</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </n-modal>

    <n-modal
      v-model:show="isShowIFrameDialog"
      :mask-closable="false"
      :show-icon="false"
      preset="dialog"
      title="联赛详情"
      style="width: 90%"
    >
      <iframe :src="iframeSrc"></iframe>
    </n-modal>
  </div>
</template>

<script setup>
import {
  getLeaguesList,
  addLeagues,
  updateLeagues,
  deleteLeagues,
  updateAllLeagues,
} from "@/api/service";
import {
  NDataTable,
  NSwitch,
  NButton,
  NModal,
  NForm,
  NFormItem,
  NInput,
  useMessage,
  useDialog,
} from "naive-ui";
import { reactive, ref, h } from "vue";

const message = useMessage();
const dialog = useDialog();
const isShowIFrameDialog = ref(false);
const iframeSrc = ref("");
const keyword = ref("");
const loading = ref(false);

const columns = ref([
  {
    title: "序号",
    width: 80,
    align: "center",
    render: (text, record, index) => {
      return record + 1;
    },
  },
  {
    title: "联赛",
    key: "name",
    render(row) {
      return h(
        "a",
        {
          href: ``,
          onClick: (e) => {
            e.preventDefault();
            iframeSrc.value = `https://data.qtx.com/jifenbang/${row.code}.html`;
            isShowIFrameDialog.value = true;
          },
        },
        `${row.name}`
      );
    },
  },
  { title: "联赛ID", key: "code" },
  {
    title: "链接",
    key: "url",
    render(row) {
      return h(
        "a",
        {
          href: `https://data.qtx.com/jifenbang/${row.code}.html`,
          onClick: (e) => {
            e.preventDefault();
            window.open(
              `https://data.qtx.com/jifenbang/${row.code}.html`,
              "_blank"
            );
          },
        },
        `https://data.qtx.com/jifenbang/${row.code}.html`
      );
    },
  },
  {
    title: "状态",
    key: "disabled",
    width: 100,
    render: (row, record, index) => {
      return h(
        NSwitch,
        {
          value: !row.disabled,
          onUpdateValue: (value) => {
            handleChangeStatus(row, value);
          },
        },
        {
          checked: () => "使用中",
          unchecked: () => "已禁用",
        }
      );
    },
  },
  {
    title: "操作",
    key: "opt",
    width: 100,
    align: "center",
    render: (row, record, index) => {
      return h(
        NButton,
        {
          type: "error",
          size: "small",
          onClick() {
            handleDelete(row);
          },
        },
        { default: () => "删除" }
      );
    },
  },
]);

const pagination = reactive({
  trigger: "click",
  placement: "bottom",
  showQuickJumper: true,
  showSizePicker: true,
  pageSize: 10,
  page: 1,
  itemCount: 0,
  pageSizes: [10, 20, 30, 40],
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

const data = ref([]);
const isShowAddDialog = ref(false);

const formRef = ref(null);
const formValue = ref({
  code: "",
  name: "",
  isActive: true,
});
const rules = ref({
  code: {
    required: true,
    message: "联赛ID不能为空",
  },
  name: {
    required: true,
    message: "联赛名称不能为空",
  },
});

const getData = (type) => {
  if (type === "search") {
    pagination.page = 1;
  }
  getLeaguesList({
    search: keyword.value.trim(),
    page: pagination.page,
    size: pagination.pageSize,
  }).then((res) => {
    data.value = res.list;
    pagination.itemCount = res.total;
  });
};

const handleChangeStatus = (row) => {
  updateLeagues({
    ...row,
    disabled: !row.disabled,
  }).then((res) => {
    if (res.code === 200) {
      message.success("修改成功！");
      row.disabled = !row.disabled;
    } else {
      message.error("修改失败！");
    }
  });
};

const handleUpdateAllLeagues = () => {
  loading.value = true;
  updateAllLeagues().finally(() => {
    loading.value = false;
  });
};

const resetForm = () => {
  formValue.value = {
    code: "",
    name: "",
    isActive: true,
  };
};

const save = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        ...formValue.value,
        disabled: !formValue.value.isActive,
      };
      delete params.isActive;

      await formRef.value.validate();
      const res = await addLeagues(params);
      if (res.code === 200) {
        getData();
        resetForm();
        resolve();
      } else {
        message.error("保存失败！" + res.message);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleDelete = (row) => {
  dialog.warning({
    title: "警告",
    content: "确定删除该数据？",
    positiveText: "确定",
    negativeText: "不确定",
    onPositiveClick: () => {
      deleteLeagues({ code: row.code }).then((res) => {
        if (res.code === 200) {
          message.success("删除成功！");
          getData();
        } else {
          message.error("删除失败！");
        }
      });
    },
    onNegativeClick: () => {
      message.error("取消删除！");
    },
  });
};

getData();
</script>

<style scoped>
.container {
  margin: 20px;
}

iframe {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>
