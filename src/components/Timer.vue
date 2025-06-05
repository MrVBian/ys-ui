<script setup lang="ts">
import { ref, computed } from "vue";
import { Alarm, ChevronLeft, Refresh } from "@vicons/tabler";
import { PlayCircle24Regular, PauseCircle24Regular } from "@vicons/fluent";
import { renderIcon } from "@/utils/render";
import { useStopwatch } from "vue-timer-hook";

const stopwatch = useStopwatch(0, false);
const isOpen = ref(false);
const isInitialized = ref(false);
const timerText = computed(() => {
  const hours = (stopwatch.days.value * 24 + stopwatch.hours.value)
    .toString()
    .padStart(2, "0");
  const minutes = stopwatch.minutes.value.toString().padStart(2, "0");
  const seconds = stopwatch.seconds.value.toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
});

function toggle() {
  if (stopwatch.isRunning.value) {
    stopwatch.pause();
  } else {
    stopwatch.start();
  }
}
</script>

<template>
  <transition name="scale" mode="out-in" :duration="{ enter: 300, leave: 20 }">
    <n-input-group v-if="isOpen">
      <n-button
        tertiary
        strong
        class="important-px-2px"
        :render-icon="renderIcon(ChevronLeft)"
        @click="isOpen = false"
      />
      <n-button tertiary strong @click="toggle" class="important-px-8px">
        <template #icon>
          <n-icon>
            <PauseCircle24Regular v-if="stopwatch.isRunning.value" />
            <PlayCircle24Regular v-else />
          </n-icon>
        </template>
        <div class="w-60px text-left">{{ timerText }}</div>
      </n-button>
      <n-button
        tertiary
        strong
        class="important-px-8px"
        :render-icon="renderIcon(Refresh)"
        @click="stopwatch.reset(0, false)"
      />
    </n-input-group>
    <n-button
      v-else
      tertiary
      strong
      class="important-px-8px"
      @click="
        () => {
          isOpen = true;
          if (!isInitialized) {
            isInitialized = true;
            stopwatch.start();
          }
        }
      "
    >
      <template #icon>
        <n-icon :class="{ breathing: stopwatch.isRunning.value }">
          <Alarm />
        </n-icon>
      </template>
    </n-button>
  </transition>
</template>

<style scoped>
@keyframes breathe-animation {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}

.breathing {
  animation: breathe-animation 2s ease-in-out infinite;
}
</style>
