<script setup lang="ts">
import { h } from "vue";
import type { MenuOption } from "naive-ui";
import Right from "./right.vue";
import { AvatarDropdown } from "./components";


const menuOptions: MenuOption[] = [
  {
    key: "Home",
    label() {
      return h("strong", { style: { fontSize: "18px" } }, "原色-AI");
    },
  },
  {
    key: "ImageEnhancement",
    label: "图像增强",
  },
  {
    key: "WatermarkRemove",
    label: "底纹去除",
  },
  {
    key: "PatternTiling",
    label: "图案提取与平铺",
  },
  {
    key: "ImageGeneration",
    label: "图像生成",
  },
  {
    key: "ColorTransfer",
    label: "色彩迁移与调色",
  },
  {
    key: "2DTo3D",
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
    <AvatarDropdown />
  </div>
</template>
