<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  to: RouteLocationRaw;
}>();
</script>

<template>
  <router-link #="{ href, navigate }" custom :to="to">
    <n-a :href="href" @click="navigate" no-underline>
      <slot />
    </n-a>
  </router-link>
</template>
