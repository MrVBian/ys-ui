<script setup lang="ts">
import { h } from "vue";
import type { MenuOption } from "naive-ui";
import Right from "./right.vue";
import { renderIcon } from "@/utils/render";

import {
  Trophy24Regular,
  Channel24Regular,
  DataTrending24Regular,
  People24Regular,
  PeopleTeam24Regular,
  Info24Regular,
} from "@vicons/fluent";

const menuOptions: MenuOption[] = [
  {
    key: "Home",
    label() {
      return h("strong", { style: { fontSize: "18px" } }, "原色-AI");
    },
  },
  {
    key: "Problems",
    label: "图像增强",
  },
  {
    key: "Contests",
    label: "底纹去除",
  },
  {
    key: "Status",
    label: "图案提取与平铺",
  },
  {
    key: "Users",
    label: "图像生成",
  },
  {
    key: "Teams",
    label: "色彩迁移与调色",
  },
  {
    key: "About",
    label: "平面图转立体图",
  },
];
</script>

<template>
  <div w-full mx-15px flex="~ justify-between items-center">
    <n-menu
      :value="$route.name as string"
      mode="horizontal"
      :options="menuOptions"
      responsive
      @update:value="(key) => $router.push({ name: key })"
    />
    <right />
  </div>
</template>
