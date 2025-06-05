<script setup lang="ts">
import { timestamp } from "@/composables/time";

defineProps<{
  time: string;
}>();
</script>

<template>
  <n-popover trigger="hover">
    <template #trigger>
      <n-time type="relative" :time="new Date(time)" :to="timestamp" />
    </template>
    <n-time :time="new Date(time)" />
  </n-popover>
</template>
