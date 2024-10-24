<template>
  <n-config-provider :locale="locale">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup>
import {
  NConfigProvider,
  zhCN,
  NMessageProvider,
  NDialogProvider,
} from "naive-ui";
import { ref } from "vue";
const locale = ref(zhCN);
</script>
<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
