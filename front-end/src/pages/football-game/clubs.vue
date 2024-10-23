<template>
  <div class="container">
    <n-button type="primary" @click="isShowAddDialog = true">添加</n-button>
    <n-data-table :columns="columns" :data="data" :pagination="pagination" />

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
        <n-form-item label="俱乐部ID" path="id">
          <n-input v-model:value="formValue.id" placeholder="输入俱乐部ID" />
        </n-form-item>
        <n-form-item label="俱乐部名称" path="club">
          <n-input
            v-model:value="formValue.club"
            placeholder="输入俱乐部名称"
          />
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
      title="俱乐部详情"
      style="width: 90%"
    >
      <iframe :src="iframeSrc"></iframe>
    </n-modal>
  </div>
</template>

<script setup>
import { getClubList, addClub, updateClub, deleteClub } from "@/api/service";
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
    title: "俱乐部",
    key: "club",
    render(row) {
      return h(
        "a",
        {
          href: ``,
          onClick: (e) => {
            e.preventDefault();
            iframeSrc.value = `https://data.qtx.com/qiudui/${row.id}.html`;
            isShowIFrameDialog.value = true;
          },
        },
        `${row.club}`
      );
    },
  },
  { title: "俱乐部ID", key: "id" },
  {
    title: "链接",
    key: "url",
    render(row) {
      return h(
        "a",
        {
          href: `https://data.qtx.com/qiudui/${row.id}.html`,
          onClick: (e) => {
            e.preventDefault();
            window.open(`https://data.qtx.com/qiudui/${row.id}.html`, "_blank");
          },
        },
        `https://data.qtx.com/qiudui/${row.id}.html`
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
  pageSizes: [10, 20, 30, 40],
});

const data = ref([]);
const isShowAddDialog = ref(false);

const formRef = ref(null);
const formValue = ref({
  id: "",
  club: "",
  isActive: true,
});
const rules = ref({
  id: {
    required: true,
    message: "俱乐部ID不能为空",
  },
  club: {
    required: true,
    message: "俱乐部名称不能为空",
  },
});

const getData = () => {
  getClubList().then((res) => {
    data.value = res.list;
  });
};

const handleChangeStatus = (row) => {
  updateClub({
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

const resetForm = () => {
  formValue.value = {
    id: "",
    club: "",
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
      const res = await addClub(params);
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
      deleteClub({ id: row.id }).then((res) => {
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
