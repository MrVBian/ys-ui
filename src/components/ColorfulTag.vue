<script setup lang="ts">
import { computed } from "vue";
import { isDark } from "@/composables/theme";

const props = defineProps<{
  lightColor: string;
  darkColor: string;
}>();

const tagColor = computed(() => {
  const color = isDark.value ? props.darkColor : props.lightColor;
  const reverseColor = isDark.value ? props.lightColor : props.darkColor;
  const rgb = color.replace(/^#/, "").match(/.{1,2}/g);
  if (!rgb) return { color, borderColor: color, textColor: reverseColor };
  const [r, g, b] = rgb.map((hex) => parseInt(hex, 16));
  return {
    color: `rgba(${r}, ${g}, ${b}, 0.1)`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
    textColor: color,
  };
});
</script>

<template>
  <n-tag v-bind="$attrs" :color="tagColor">
    <slot></slot>
  </n-tag>
</template>
