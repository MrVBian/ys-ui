<script setup lang="ts"></script>

<template>
  <div class="relative">
    <n-skeleton :width="160" :sharp="false" size="medium" />
    <div class="inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.inner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
}
</style>
