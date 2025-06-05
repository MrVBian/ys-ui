<script setup lang="ts">
import { computed } from "vue";
import { SubtractCircle24Regular } from "@vicons/fluent";

const props = defineProps<{ value: string[] }>();
const emits = defineEmits(["update:value"]);

const data = computed({
  get: () => props.value,
  set: (value: string[]) => emits("update:value", value),
});

const addValue = () => {
  data.value = [...data.value, ""];
};
const removeValue = (index: number) => {
  data.value = data.value.filter((_, i) => i !== index);
};
</script>

<template>
  <n-flex vertical class="w-full">
    <div v-for="i in data.length" :key="i" flex="~ items-center gap-8px">
      <n-input v-model:value="data[i - 1]" />
      <n-button text type="error" @click="removeValue(i - 1)">
        <n-icon :size="20">
          <SubtractCircle24Regular />
        </n-icon>
      </n-button>
    </div>
    <n-button @click="addValue">添加值</n-button>
  </n-flex>
</template>
