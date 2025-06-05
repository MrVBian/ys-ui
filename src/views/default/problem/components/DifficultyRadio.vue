<script setup lang="ts">
import { ref, computed } from "vue";
import { webConfig } from "@/composables/app";

const props = defineProps({
  defaultValue: {
    type: Number,
    default: 0,
  },
});
const emits = defineEmits(["update:value"]);

const _value = ref(props.defaultValue);

const difficulty = computed({
  get() {
    return _value.value;
  },
  set(value) {
    _value.value = value;
    emits("update:value", value);
  },
});
</script>

<template>
  <n-radio-group v-model:value="difficulty" name="difficulty">
    <n-flex vertical>
      <n-radio
        v-for="item of webConfig.problem_difficulties"
        :key="item.id"
        :value="item.id"
      >
        <span :style="item.color ? { color: item.color } : {}">
          {{ item.name }}
        </span>
      </n-radio>
    </n-flex>
  </n-radio-group>
</template>
