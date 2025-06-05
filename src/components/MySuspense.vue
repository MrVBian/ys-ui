<template>
  <suspense timeout="0">
    <slot />
    <template #fallback>
      <div
        :style="{ aspectRatio }"
        class="w-full mb-10px relative rounded-3px"
        :class="classList"
      >
        <n-spin class="center" :description="description" />
      </div>
    </template>
  </suspense>
</template>

<script lang="ts" setup>
import { computed } from "vue";
const props = defineProps({
  aspectRatio: {
    type: String,
    default: "16/9",
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  description: String,
});
const classList = computed(() =>
  props.bordered ? ["border", "border-solid", "border-[--divider-color]"] : [],
);
</script>

<style scoped>
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
