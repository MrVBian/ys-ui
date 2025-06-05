<script setup lang="ts">
import { computed, ref } from "vue";
import { getStringSizeInBytes } from "@/utils/string";
import type { InputInst } from "naive-ui";

const props = defineProps<{
  value: string;
  maxlength: number;
}>();

const emits = defineEmits<{
  (e: "update:value", value: string): void;
}>();

const inputRef = ref<InputInst | null>(null);

function focus() {
  inputRef.value?.focus();
}

defineExpose({
  focus,
});

const innerValue = computed({
  get() {
    return props.value;
  },
  set(value: string) {
    emits("update:value", value);
  },
});
</script>

<template>
  <n-input
    ref="inputRef"
    v-model:value="innerValue"
    show-count
    :maxlength="maxlength"
    :count-graphemes="getStringSizeInBytes"
    v-bind="$attrs"
  />
</template>
