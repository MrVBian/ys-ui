<script setup lang="ts">
import { h, computed, type Component, ref, onMounted, onBeforeUnmount } from "vue";
import {  } from "vue";
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


const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
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
          v-show="!isMobile"
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
            {{ !isMobile ? '提交' : '' }}
          </n-button>
          <n-button
            @click="handleSubmit"
            tertiary
            strong
            type="primary"
            :render-icon="renderIcon(CloudUpload)"
          >
            {{ !isMobile ? '运行' : '' }}
          </n-button>
        </n-input-group>
      </transition>
      <Timer v-show="!isMobile"/>
    </n-flex>
    <right :class="['right-item', { 'is-mobile': isMobile }]" />
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

/* 新增 right 组件样式 */
.right-item {
  transition: all 0.3s ease;
}

.right-item.is-mobile {
  transform: scale(0.9) !important;
  margin-left: -8px !important;
}

.right-item.is-mobile :deep(.n-button) {
  --n-padding: 0 4px !important;
  min-width: 40px;
  height: 32px;
  margin-right: -5px
}
</style>
