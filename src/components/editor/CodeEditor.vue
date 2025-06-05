<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  value: string;
  disabled?: boolean;
}>();
const emit = defineEmits(["update:value"]);

const code = computed({
  get: () => props.value,
  set: (value: string) => {
    emit("update:value", value);
  },
});
</script>

<template>
  <n-input
    type="textarea"
    v-model:value="code"
    :disabled="disabled"
    placeholder="开发CodeEditor中, 敬请期待..."
  />
</template>
