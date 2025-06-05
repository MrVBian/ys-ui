<script setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BookSet = defineProps({
  name: String,
  imageSrc: String
});
</script>

<template>
  <n-card :title="name">
    <template #cover>
      <a href="#" 
        class="book-link"
        style="
          display: block;
          text-align: center;
          background-color: #f0f0f0;
          padding: 6px 10px;
          border-radius: 8px;  /* 容器统一圆角 */
        ">
        <img :src="imageSrc"
            style="
              height: 100px;
              object-fit: contain;
              display: inline-block;
              border-radius: 6px;  /* 图片圆角 */
              transition: transform 0.3s ease;  /* 添加缩放过渡 */
            "
            onmouseover="this.style.transform='scale(1.15)'"
            onmouseout="this.style.transform='scale(1)'">
      </a>
    </template>
  </n-card>
</template>

<style scoped>
  .book-link {
    transition: background-color 0.3s ease;
  }
  .book-link:hover {
    background-color: #e0e0e0 !important;
  }

  /* 标题显示3行 */
  :deep(.n-card-header .n-card-header__main) {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 3;

    /* 精确高度控制 */
    line-height: 1.5;
    min-height: 4.5em;  /* 3行 × 1.5em */
    max-height: 4.5em;
    font-size: 16px;    /* 必须明确指定，否则em计算不准 */
  }

</style>