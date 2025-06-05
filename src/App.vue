<script setup lang="ts">
import { computed, watch } from "vue";
import { isDark } from "@/composables/theme";
import { token, userInfo, type UserInfo } from "@/composables/auth";
import request from "@/utils/request.ts";
import { zhCN, dateZhCN, darkTheme } from "naive-ui";
import { useDebounceFn } from "@vueuse/core";
import katex from "katex";
import "katex/dist/katex.css";
import hljs from "@/utils/hljs";

const theme = computed(() => (isDark.value ? darkTheme : undefined));

const _ = (window as any).ResizeObserver;
(window as any).ResizeObserver = class ResizeObserver extends _ {
  constructor(callback: (...args: any[]) => void) {
    callback = useDebounceFn(callback, 20);
    super(callback);
  }
};

watch(
  token,
  () => {
    if (token.value) {
      request.get<UserInfo>("/auth/info").then((data) => {
        userInfo.value = data;
      });
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="theme"
    :hljs="hljs"
    :katex="katex"
    inline-theme-disabled
  >
    <n-dialog-provider>
      <n-loading-bar-provider>
        <n-message-provider :max="1">
          <n-modal-provider>
            <n-notification-provider>
              <global-inject>
                <router-view />
              </global-inject>
            </n-notification-provider>
          </n-modal-provider>
        </n-message-provider>
      </n-loading-bar-provider>
    </n-dialog-provider>
    <n-global-style />
  </n-config-provider>
</template>
