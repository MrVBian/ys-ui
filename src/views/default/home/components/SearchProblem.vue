<script setup lang="ts">
import { Search24Regular } from "@vicons/fluent";
</script>

<template>
  <n-card segmented size="small">
    <template #header>
      <text-with-icon>
        <template #icon>
          <n-icon :size="22">
            <Search24Regular />
          </n-icon>
        </template>
        搜索题目
      </text-with-icon>
    </template>
    <n-input round placeholder="题目名/ID">
      <template #prefix>
        <n-icon :size="20">
          <Search24Regular />
        </n-icon>
      </template>
    </n-input>
  </n-card>
</template>

