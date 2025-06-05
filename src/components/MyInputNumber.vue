<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  value: number;
  nullValue?: number;
}>();

const emit = defineEmits<{
  (e: "update:value", value: number): void;
}>();

const innerValue = computed<number | null>({
  get() {
    return props.value;
  },
  set(value) {
    if (value === null) {
      emit("update:value", props.nullValue ?? 0);
    } else {
      emit("update:value", value);
    }
  },
});
</script>

<template>
  <n-input-number v-model:value="innerValue" v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </n-input-number>
</template>
