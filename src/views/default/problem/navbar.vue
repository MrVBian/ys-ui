<script setup lang="ts">
import { h, computed, type Component } from "vue";
import type { MenuOption } from "naive-ui";
import Right from "@/layouts/default/children/right.vue";
import { Channel24Regular } from "@vicons/fluent";
import {
  CloudUpload,
  PlayerPlay,
  CircleCheck,
  CircleX,
  ChevronLeft,
  ChevronRight,
  ArrowsShuffle,
} from "@vicons/tabler";
import { renderIcon } from "@/utils/render";
import { useSharedProblemAction } from "@/composables/problem";

const menuOptions: MenuOption[] = [
  {
    key: "Home",
    label() {
      return h("strong", { style: { fontSize: "18px" } }, "原色-AI");
    },
  },
  {
    icon: renderIcon(Channel24Regular),
    key: "Problems",
    label: "题目",
  },
];

const {
  running,
  submitting,
  runningOrSubmittingText,
  resultText,
  submissionId,
  currentLanguageId,
  currentCode,
} = useSharedProblemAction();

function handleSubmit() {
  if (!currentLanguageId.value) {
    window.$message.error("请选择语言");
    return;
  }
  if (!currentCode.value) {
    window.$message.error("请输入代码");
    return;
  }
  submitting.value = true;
  runningOrSubmittingText.value = "等待评测...";
}

const resultCfg = computed(() => {
  let typ: "error" | "warning" | "success" = "error";
  let icn: Component = CircleX;
  switch (resultText.value) {
    case "编译错误":
      typ = "warning";
      break;
    case "答案正确":
      typ = "success";
      icn = CircleCheck;
      break;
  }
  return { type: typ, icon: icn };
});
</script>

<template>
  <div w-full mx-15px relative flex="~ justify-between items-center">
    <n-menu
      class="flex-auto"
      :value="$route.name as string"
      mode="horizontal"
      :options="menuOptions"
      @update:value="(key) => $router.push({ name: key })"
    />
    <n-flex class="center" size="small" :wrap="false">
      <n-input-group>
        <n-button
          title="上一题"
          tertiary
          strong
          disabled
          class="important-px-8px"
          :render-icon="renderIcon(ChevronLeft)"
        />
        <n-button
          title="下一题"
          tertiary
          strong
          disabled
          class="important-px-8px"
          :render-icon="renderIcon(ChevronRight)"
        />
        <n-button
          title="随机一题"
          tertiary
          strong
          disabled
          class="important-px-8px"
          :render-icon="renderIcon(ArrowsShuffle)"
        />
      </n-input-group>
      <transition
        name="scale"
        mode="out-in"
        :duration="{ enter: 300, leave: 20 }"
      >
        <MySkeleton v-if="running || submitting">
          {{ runningOrSubmittingText }}
        </MySkeleton>
        <n-tag
          v-else-if="resultText"
          :type="resultCfg.type"
          class="h-34px"
          :bordered="false"
          closable
          @close="
            () => {
              resultText = '';
              submissionId = '';
            }
          "
        >
          <template #icon>
            <n-icon :component="resultCfg.icon" />
          </template>
          {{ resultText }}
        </n-tag>
        <n-input-group v-else>
          <n-button
            @click="running = true"
            tertiary
            strong
            disabled
            :render-icon="renderIcon(PlayerPlay)"
          >
            运行
          </n-button>
          <n-button
            @click="handleSubmit"
            tertiary
            strong
            type="primary"
            :render-icon="renderIcon(CloudUpload)"
          >
            提交
          </n-button>
        </n-input-group>
      </transition>
      <Timer />
    </n-flex>
    <right />
  </div>
</template>

<style scoped>
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}
</style>
