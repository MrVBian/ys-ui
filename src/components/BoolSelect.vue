<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  value: boolean | null;
  trueLabel?: string;
  falseLabel?: string;
  trueColor?: string;
  falseColor?: string;
}>();

const emits = defineEmits<{
  (e: "update:value", val: boolean | null): void;
}>();

const options = computed(() => [
  {
    label: props.trueLabel ?? "是",
    value: 1,
    style: props.trueColor ? `color: ${props.trueColor}` : "",
  },
  {
    label: props.falseLabel ?? "否",
    value: 0,
    style: props.falseColor ? `color: ${props.falseColor}` : "",
  },
]);

const innerValue = computed({
  get() {
    if (props.value === null) {
      return null;
    }
    if (props.value === true) {
      return 1;
    }
    return 0;
  },
  set(val: number | null) {
    if (val === null) {
      emits("update:value", null);
    } else if (val === 1) {
      emits("update:value", true);
    } else if (val === 0) {
      emits("update:value", false);
    }
  },
});
</script>

<template>
  <n-select v-model:value="innerValue" :options="options" v-bind="$attrs" />
</template>
