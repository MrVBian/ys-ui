<script setup lang="ts">
import { ref, PropType } from "vue";
import request from "@/utils/request.ts";

defineProps({
  autoplay: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 3000,
  },
  showArrow: {
    type: Boolean,
    default: true,
  },
  dotType: {
    type: String as PropType<"dot" | "line">,
    default: "line",
  },
});

const carousels = ref<string[]>([]);
carousels.value = await request.get<string[]>("/home/carousels");
</script>

<template>
  <n-carousel
    v-if="carousels.length"
    :autoplay="autoplay"
    :interval="interval"
    :show-arrow="showArrow"
    :dot-type="dotType"
    rounded-3px
  >
    <img
      v-for="(img, index) of carousels"
      :key="index"
      :src="img"
      :alt="`image-${index}`"
      class="carousel-img"
    />
  </n-carousel>
</template>

<style scoped>
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
