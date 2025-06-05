<script setup lang="ts">
import { computed } from "vue";
import { darkTheme } from "naive-ui";

const props = defineProps<{
  dark?: boolean;
}>();

const theme = computed(() => (props.dark ? darkTheme : null));
</script>

<template>
  <n-config-provider :theme="theme">
    <slot></slot>
  </n-config-provider>
</template>
