<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { SingleChoiceBox, MulChoiceBox, JudgeBox, BlankBox, QuestionList, SubjectiveBox, FunctionBox, ProgramBox, MulFileBox } from "./components";
import { cards, legends, singleChoiceList, mulChoiceList, judgeList, blankList, subjectiveList, programList } from '@/data/exam'

import { useRoute } from 'vue-router';
import { Console } from "console";
const route = useRoute();
const key = route.params.key;
const index = route.params.index;

const parseSafeIndex = (val: string | undefined | string[]): number => {
  if (typeof val === 'undefined') return -1;

  if (Array.isArray(val)) {
    if (val.length === 0) return -1;
    val = val[0];
    if (typeof val === 'undefined') return -1;
  }

  if (val === '') return -1;

  const num = Number(val);
  return (
    !isNaN(num) &&
    Number.isInteger(num) &&
    num >= 0 && // 仅允许正整数
    num < Number.MAX_SAFE_INTEGER
  ) ? num : -1;
};
const questionIndex = parseSafeIndex(index)
console.log('路由参数 ', key, questionIndex);



const gridItemCount = ref(63);
const activeIndex = ref(-1);
const selectedIndex = ref(null);

const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
});



const handleCardClick = (index) => {
  activeIndex.value = activeIndex.value === index ? -1 : index;
};
const handleClick = (index) => {
  selectedIndex.value = index;
};
const flaggedIndices = ref<Record<number, boolean>>({});
const flagClick = () => {
  if (selectedIndex.value !== null) {
    // 切换当前选中索引的标记状态
    flaggedIndices.value[selectedIndex.value] = !flaggedIndices.value[selectedIndex.value];
  }
};

const revealAnswers = ref(false)
const showAnswers = () => {
  revealAnswers.value = true
}
</script>

<template>

  <n-layout>
    <div class="desktop-layout">
      <!-- 左侧固定区域 -->
      <n-card 
        v-show="!isMobile"
        class="left-panel"
        :content-style="{ 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden' 
        }"
      >
        <div class="list-title">
          <span>题目类型</span>
          <span>作答/题数</span>
        </div>

        <div class="card-scroll-container">
          <n-space 
            vertical 
            style="flex: 1; overflow: hidden;"
          >
            <n-card 
              v-for="(card, index) in cards"
              :key="index"
              size="small"
              hoverable
              :class="['type-card', { 'active-card': activeIndex === index }]"
              @click="handleCardClick(index)"
            >
              <div class="card-content">
                <div class="left-section">
                  <img :src="card.icon" class="type-icon"/>
                  <span class="type-text">{{ card.title }}</span>
                </div>
                <div class="right-section">{{ card.accNum }}/{{ card.examNum }}</div>
              </div>
            </n-card>
          </n-space>
        </div>

        <!-- <n-divider/> -->

        <n-space style="display: flex; justify-content: space-between; align-items: baseline;" :item-style="{ marginBottom: '5px' }">
          <span>题型</span>
          <n-button @click="flagClick()">标记</n-button>
          <n-popover trigger="hover" placement="top">
            <template #trigger>
              <n-button>图例</n-button>
            </template>
            <div style="
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              padding: 8px;
            ">
              <div 
                v-for="item in legends" 
                :key="item.id"
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 4px;
                "
              >
                <img 
                  :src="item.img" 
                  style="
                    width: 40px;
                    height: 40px;
                    object-fit: contain;
                  "
                />
                <span style="font-size: 12px">{{ item.text }}</span>
              </div>
            </div>
          </n-popover>
        </n-space>

        <n-grid 
          :cols="5" 
          :x-gap="8" 
          :y-gap="8" 
          class="scroll-container"
          style="overflow-y: auto; padding-right: 8px;"
        >
          <n-gi
            v-for="i in gridItemCount"
            :key="i"
            :class="[
              { 'selected-border': selectedIndex === i },
              { 'review-flag': flaggedIndices[i] },  // 动态绑定标记类
              i === 6 ? ['correct-answer', 'review-flag'] : 
              i === 7 ? ['evaluation-answer', 'review-flag'] : 
              i === 8 ? ['wrong-answer', 'review-flag'] : 
              i === 9 ? ['review-flag'] : [],
              i === 1 ? ['correct-answer'] : [],
              i === 2 ? ['evaluation-answer'] : [],
              i === 3 ? ['wrong-answer'] : [],
            ]"
            class="grid-item"
            @click="handleClick(i)"
          >
            {{ i }}
          </n-gi>
        </n-grid>
      </n-card>


      <!-- 移动端顶部导航 -->
      <div v-if="isMobile" class="mobile-top-nav">
        <div>
          <div class="horizontal-scroll">
            <n-card 
              v-for="(card, index) in cards"
              :key="index"
              size="small"
              hoverable
              :class="['mobile-type-card', { 'active-card': activeIndex === index }]"
              @click="handleCardClick(index)"
              :style="{ width: 'auto' }"
            >
              <div class="mobile-card-content">
                <img :src="card.icon" class="type-icon"/>
                <div class="mobile-card-text">
                  <div class="nowrap-text">{{ card.title }} {{ card.examNum }}</div>
                </div>
              </div>
            </n-card>
          </div>
        </div>
      </div>



      <!-- 右侧滚动区域 -->
      <n-card
        class="right-panel"
        :content-style="{ 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden' 
        }"
      >
        <div class="scrollable-content">
          <template v-if="key === '1'">
            <SingleChoiceBox
              v-for="(item, index) in singleChoiceList"
              :key="`single-choice-1-${index}`"
              :id="item.id"
              :score="item.score"
              :question="item.question"
              :options="item.options"
              :correct-index="item.correctIndex"
              :explanation="item.explanation"
              :reveal="revealAnswers"
            />
          </template>

          <template v-else-if="key === '2'">
            <MulChoiceBox
              v-for="(item, index) in mulChoiceList"
              :key="`mul-choice-2-${index}`"
              :id="item.id"
              :score="item.score"
              :question="item.question"
              :options="item.options"
              :correctIndices="item.correctIndices"
              :explanation="item.explanation"
              :reveal="revealAnswers"
            />
          </template>

          <template v-else-if="key === '3'">
            <JudgeBox
              v-for="(item, index) in judgeList"
              :key="`judge-3-${index}`"
              :id="item.id"
              :question="item.question"
              :correct-index="item.correctIndex"
              :explanation="item.explanation"
              :reveal="revealAnswers"
            />
          </template>

          <template v-else-if="key === '4'">
            <BlankBox
              v-for="(item, index) in blankList"
              :key="`blank-4-${index}`"
              :id="item.id"
              :score="item.score"
              :question="item.question"
              :correctAnswers="item.correctAnswers"
              :explanation="item.explanation"
              :reveal="revealAnswers"
            />
          </template>

          <template v-if="key === '5'">

            <QuestionList v-if="questionIndex === -1" :questions="subjectiveList"/>

            <SubjectiveBox
              v-if="questionIndex !== -1"
              :key="`subject-4-${index}`"
              :id="subjectiveList[questionIndex].id"
              :title="subjectiveList[questionIndex].title"
              :score="subjectiveList[questionIndex].score"
              :question="subjectiveList[questionIndex].question"
              :explanation="subjectiveList[questionIndex].explanation"
              :reveal="revealAnswers"
            />
            
          </template>

          <template v-if="key === '6'">
            <FunctionBox
              :reveal="revealAnswers"
            />
          </template>

          <template v-if="key === '7'">

            <QuestionList v-if="questionIndex === -1" :questions="programList"/>
            <ProgramBox
              v-if="questionIndex !== -1"
              :reveal="revealAnswers"
            />
          </template>

          <template v-if="key === '8'">
            <MulFileBox
              :reveal="revealAnswers"
            />
          </template>

          <button v-if="Number(key) >= 1 && Number(key) <= 4" class="submit-btn" @click="showAnswers">提交答案</button>
        </div>
      </n-card>
    </div>
  </n-layout>
</template>

<style scoped>

.desktop-layout {
  display: flex;
  height: 93vh;
  background: #fff;
}

.left-panel {
  flex: 0 0 280px;
  min-width: 240px;
  max-width: 320px;
  border-right: 1px solid var(--n-border-color);
  border-radius: 0;
  transition: all 0.3s ease;
  :deep(.n-card__content) {
    padding: 16px !important;
  }
}

.right-panel {
  flex: 1;
  min-width: 400px;
  :deep(.n-card__content) {
    padding: 24px !important;
  }
}

.card-scroll-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 12px;
  min-height: 200px;
  max-height: calc(50vh - 100px);
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  max-height: calc(50vh - 100px);
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 12px;
  min-height: 500px;
}

.list-title {
  display: flex;
  justify-content: space-between;
  padding: 0 4px 8px;
  font-size: 14px;
}

.type-card {
  padding: var(--card-padding) !important;
  transition: all 0.2s ease;
  display: flex;
  cursor: pointer;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-section {
  display: flex;
  align-items: center;  /* 确保垂直居中 */
  gap: 5px;
  height: 100%;
}

.type-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  vertical-align: middle;
}

.type-text {
  font-size: 12px;
  line-height: 1.2;
  transform: translateY(0.5px);
}

.right-section {
  font-size: 10px;
  color: #666;
  white-space: nowrap;
  padding-left: 8px;
}

.grid-item {
  height: 32px;
  border: 2px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8f8f8;
}

.active-card {
  border-color: #2080f0 !important;
  background: #f0faff;
}

.selected-border {
  border: 2px solid #2080f0 !important;  /* 加粗并改为蓝色 */
  animation: border-glow 1.5s infinite ease-in-out; /* 添加呼吸动画 */
  box-shadow: 
    0 0 5px rgba(24, 144, 255, 0.5),  /* 基础发光 */
    0 0 10px rgba(24, 144, 255, 0.3),  /* 第二层光晕 */
    inset 0 0 8px rgba(24, 144, 255, 0.2); /* 内发光效果 */
  position: relative; /* 为伪元素定位准备 */
}
.grid-item:hover {
  border: 2px dashed #2080f0 !important;
  background: #fff;
}


.evaluation-answer {
  border: 2px solid #1a94bc;
  background: #f0faff;
  position: relative;
  overflow: hidden;
}
.evaluation-answer::after {
  content: "⏳";
  position: absolute;
  top: 2px;
  right: 2px;
  color: #1a94bc;
  font-weight: bold;
  font-size: 0.6em;
}
.correct-answer {
  border: 2px solid #10b981;
  background: #ecfdf5;
  position: relative;
  overflow: hidden;
}
.correct-answer::after {
  content: "✔️";
  position: absolute;
  top: 2px;
  right: 2px;
  color: #10b981;
  font-weight: bold;
  font-size: 0.6em;
}
.wrong-answer {
  border: 2px solid #ef4444;
  background: #fef2f2;
  position: relative;
  overflow: hidden;
}
.wrong-answer::after {
  content: "❌";
  position: absolute;
  top: 2px;
  right: 2px;
  color: #ef4444;
  font-weight: bold;
  font-size: 0.6em;
}
.review-flag {
  position: relative;
}
.review-flag::before {
  content: "🚩";
  position: absolute;
  bottom: -1px;
  right: 1px;
  font-size: 0.6em;
  transform: rotate(15deg);
  z-index: 1;
  pointer-events: none;
}




/* 移动端顶部导航 */
.mobile-top-nav {
  position: fixed;
  top: 5%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-height: 70vh;
}

.horizontal-scroll {
  display: flex;
  overflow-x: auto;
  gap: 4px;
  padding: 4px 5px 4px 5px; /* 调整左右内边距 */
  margin: 0; /* 移除负边距 */
  scroll-padding: 0 18x; /* 滚动对齐内边距 */
  scrollbar-gutter: stable; /* 防止滚动条出现时跳动 */
  
  /* 针对webkit浏览器优化滚动条 */
  &::-webkit-scrollbar {
    height: 2px;
  }
}

.mobile-type-card {
  --n-padding-top: 6px;
  --n-padding-bottom: 6px;
}

.mobile-controls {
  .legend-btn {
    margin-right: auto;
  }
}

.mobile-grid {
  padding-bottom: 16px;
}

/* 调整桌面布局的移动端适配 */
.desktop-layout.mobile-layout {
  margin-top: 70vh;
  height: calc(100vh - 70vh);
}

/* 原右侧面板在移动端的调整 */
.right-panel {
  :deep(.n-card__content) {
    padding: 16px;
  }
}

.mobile-card-content {
  display: inline-flex; /* 改为行内弹性盒 */
  align-items: center;
  gap: 6px; /* 适当增加间距 */
}

.nowrap-text {
  white-space: nowrap;  /* 文本不换行 */
}




@media (max-width: 768px) {
  .right-panel {
    :deep(.n-card__content) {
      padding: 16px !important;
    }
  }
  
  .scrollable-content {
    padding-right: 8px;
  }
}
</style>