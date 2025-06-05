<script lang="ts" setup>
import {
  useDialog,
  useLoadingBar,
  useMessage,
  useModal,
  useNotification,
} from "naive-ui";
import { provide } from "vue";
import { THEME_KEY } from "vue-echarts";
import { useRoute, useRouter } from "vue-router";
import { echartsTheme } from "@/composables/theme";

provide(THEME_KEY, echartsTheme);

window.$dialog = useDialog();
window.$loadingBar = useLoadingBar();
window.$message = useMessage();
window.$modal = useModal();
window.$notification = useNotification();
window.$route = useRoute();
window.$router = useRouter();
</script>

<template>
  <n-el h-100vh w-100vw select-none>
    <slot />
  </n-el>
</template>
