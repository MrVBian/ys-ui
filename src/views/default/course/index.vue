<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

import {
  Book,
  LeftMenu,
} from "./components";

const isMobile = ref(false)
// 响应式检测
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

const books = ref([
  { name: '“101计划”核心课程实践教材《数据结构实验指导 - C语言版》题目集', image: '/course/book.jpg', problemTotal: 50 },
  { name: '浙大版《80x86汇编语言程序设计基础》题目集', image: '/course/book.jpg', problemTotal: 50 },
  { name: '《PAT 备考通》题目集', image: '/course/book.jpg', problemTotal: 50 },
  { name: '浙大版《C语言程序设计（第4版）》题目集', image: '/course/book.jpg', problemTotal: 50 },
  { name: '浙大版《C语言程序设计实验与习题指导（第4版）》题目集', image: '/course/book.jpg', problemTotal: 50 },
  { name: '浙大版《C语言程序设计（第3版）》题目集', image: '/course/book.jpg', problemTotal: 50 },
  { name: '浙大版《C语言程序设计实验与习题指导（第3版）》题目集', image: '/course/book.jpg', problemTotal: 50 },
  { name: '浙大版《数据结构（第2版）》题目集', image: '/course/book.jpg', problemTotal: 50 },
])



</script>

<template>
  <n-layout style="height: 100vh">
    <!-- 桌面端三栏布局 -->
    <div class="desktop-layout">
      <!-- 左侧菜单栏 -->
      <n-card 
        v-show="!isMobile"
        class="left-panel"
        title="导航"
        :content-style="{ height: '100%' }"
      >
        <LeftMenu />
      </n-card>

      <!-- 中间内容区 -->
      <n-layout-content class="main-content">
        <h1>大标题</h1>
        <h2>大学教材</h2>
        <n-grid :x-gap="12" :y-gap="8" :cols="isMobile?2:4" responsive="screen">
          <n-grid-item v-for="(book, index) in books" :key="book.name">
            <Book 
              :key="index"
              :title="book.name"
              :image-src="book.image"
              size="small"
            />
          </n-grid-item>
        </n-grid>
      </n-layout-content>

      <!-- 右侧标签栏 -->
      <n-card
        v-show="!isMobile"
        class="right-panel"
        :content-style="{ height: '100%', 'flex-direction': 'column', display: 'flex', gap: '10px'  }"
      >
        <n-tabs type="segment">
          <n-tab-pane name="tags" tab="自定义区块1" />
        </n-tabs>
        <n-tabs type="segment">
          <n-tab-pane name="tags" tab="自定义区块2" />
        </n-tabs>
        
        <n-card title="卡片" hoverable>
          卡片内容
        </n-card>

        <n-card title="热门推荐">
          <template #cover>
            <img src="/course/hot.png">
          </template>
          《PAT 备考通》题目集
        </n-card>

      </n-card>
    </div>

    <!-- 移动端单栏布局 -->
    <div v-if="isMobile" class="mobile-content">
      <router-view />
    </div>
  </n-layout>
</template>


<style scoped>

/* 桌面端布局 */
.desktop-layout {
  display: flex;
  height: 100vh;
}

.left-panel {
  flex: 1;
  max-width: 20%;
  min-width: 200px;
  border-radius: 0;
  border-right: 1px solid var(--n-border-color);
}

.main-content {
  flex: 3;
  padding: 20px;
  overflow: auto;
}

.right-panel {
  flex: 1;
  max-width: 20%;
  min-width: 200px;
  border-left: 1px solid var(--n-border-color);
  border-radius: 0;
}

/* 移动端布局 */
.mobile-content {
  height: 100vh;
  padding: 12px;
  overflow: auto;
}



/* 移动端适配 */
@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }
  
  /* 隐藏左右面板的占位空间 */
  .left-panel,
  .right-panel {
    display: none;
  }
}

</style>