<script setup lang="ts">
import { ref, PropType } from "vue";
import { ChevronDown16Filled } from "@vicons/fluent";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  segmented: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<"small" | "medium" | "large">,
    default: "small",
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const _collapsed = ref(props.collapsed);
</script>

<template>
  <n-card :segmented="segmented" :size="size" v-bind="$attrs">
    <div
      @click="_collapsed = !_collapsed"
      flex="~ items-center"
      class="color-[var(--n-title-text-color)] font-500 font-size-14px cursor-pointer"
    >
      <n-icon
        class="transition-all-100"
        :size="16"
        :style="{ rotate: _collapsed ? '-90deg' : '0deg' }"
      >
        <ChevronDown16Filled />
      </n-icon>
      <span>{{ title }}</span>
    </div>
    <n-collapse-transition :show="!_collapsed">
      <div class="mt-15px">
        <slot />
      </div>
    </n-collapse-transition>
  </n-card>
</template>
