<script setup lang="ts">
import { ref } from "vue";

defineProps({
  vertical: {
    type: Boolean,
    default: false,
  },
  resizeTriggerSize: {
    type: Number,
    default: 14,
  },
});

const dragging = ref(false);
</script>

<template>
  <n-split
    :direction="vertical ? 'vertical' : 'horizontal'"
    :resize-trigger-size="resizeTriggerSize"
    v-bind="$attrs"
    @drag-start="dragging = true"
    @drag-end="dragging = false"
    :style="{
      '--splitter-bg-color': 'var(--text-color-2)',
      '--dragging-splitter-bg-color': 'var(--text-color-base)',
      '--dragging-bg-color': 'var(--border-color)',
    }"
  >
    <template #1>
      <slot name="1"></slot>
    </template>
    <template #2>
      <slot name="2"></slot>
    </template>
    <template #resize-trigger>
      <div
        :class="['splitter', vertical && 'vertical', dragging && 'dragging']"
      ></div>
    </template>
  </n-split>
</template>

<style scoped>
.splitter {
  background: transparent;
  border: transparent;
  width: 100%;
  height: 100%;
  position: relative;
}

.dragging.splitter {
  /*noinspection CssUnresolvedCustomProperty*/
  background-color: var(--dragging-bg-color);
  transition: background-color 0.3s;
}

.dragging.splitter:before {
  /*noinspection CssUnresolvedCustomProperty*/
  background-color: var(--dragging-splitter-bg-color);
  transition: background-color 0.3s;
}

.splitter:before {
  content: "";
  position: absolute;
  width: 3px;
  height: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*noinspection CssUnresolvedCustomProperty*/
  background-color: var(--splitter-bg-color);
  border-radius: 3px;
  opacity: 0.5;
}

.vertical.splitter:before {
  width: 30px;
  height: 3px;
}
</style>
