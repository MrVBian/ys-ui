<script setup>
import { ref } from 'vue'

const props = defineProps({
  id: String,
  question: String,
  correctAnswer: Boolean,  // true表示正确，false表示错误
  reveal: {
    type: Boolean,
    default: false
  },
  explanation: String
})

const selectedAnswer = ref(null)

const selectAnswer = (value) => {
  if (!props.reveal) {
    selectedAnswer.value = value
  }
}
</script>

<template>
  <div class="judgement-container">
    <!-- 元信息 -->
    <div class="meta-info">
      <span class="question-id">
        <span>{{ id }}</span>
      </span>
      
      <span class="question-points">
        <svg class="star-icon" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z"/>
        </svg>
        <span>分数2</span>
      </span>
    </div>

    <!-- 问题题干 -->
    <h3 class="question-title">{{ question }}</h3>

    <!-- 判断选项 -->
    <div class="options-list">
      <div 
        class="judge-option"
        :class="{
          'judge-selected': selectedAnswer === true,
          'judge-correct': reveal && correctAnswer,
          'judge-incorrect': reveal && selectedAnswer === true && !correctAnswer
        }"
        @click="selectAnswer(true)"
      >
        <div class="option-content">
          <span class="option-label">A.</span>
          <span class="option-text">正确</span>
          <transition name="scale-fade">
            <span v-if="reveal && correctAnswer" class="status-mark">✓</span>
          </transition>
        </div>
      </div>

      <div 
        class="judge-option"
        :class="{
          'judge-selected': selectedAnswer === false,
          'judge-correct': reveal && !correctAnswer,
          'judge-incorrect': reveal && selectedAnswer === false && correctAnswer
        }"
        @click="selectAnswer(false)"
      >
        <div class="option-content">
          <span class="option-label">B.</span>
          <span class="option-text">错误</span>
          <transition name="scale-fade">
            <span v-if="reveal && !correctAnswer" class="status-mark">✓</span>
          </transition>
        </div>
      </div>
    </div>

    <!-- 答案解析 -->
    <transition name="expand">
      <div v-if="reveal && explanation" class="explanation-panel">
        <div class="panel-header">
          <svg class="hint-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <h4 class="panel-title">题目解析</h4>
        </div>
        <pre class="explanation-content">{{ explanation }}</pre>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* 容器样式 */
.judgement-container {
  margin: 16px 0;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s;
}

/* 元信息 */
.meta-info {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.question-id, .question-points {
  display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.1rem 0.6rem;
    border-radius: 6px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    color: #495057;
    font-weight: 500;
    transition: all 0.2s;
}

.question-points {
  color: #2b8a3e;
}

.star-icon {
  color: #f59f00;
}

.id-icon {
  opacity: 0.8;
}

/* 题干 */
.question-title {
  color: #1a1a1a;
  margin: 12px 0;
  font-size: 1.1em;
  line-height: 1.5;
}

/* 选项列表 */
.options-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 选项项 */
.judge-option {
  padding: 12px 16px;
  border: 2px solid #ebeef5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  background: white;
}

.judge-option:hover {
  background: #f8fafc;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label {
  font-weight: 600;
  color: #606266;
}

.option-text {
  font-family: system-ui, -apple-system, sans-serif;
  color: #303133;
}

/* 状态样式 */
.judge-selected {
  border-color: #409eff;
  background: #f5faff;
}

.judge-correct {
  border-color: #67c23a !important;
  background: #f0f9eb !important;
}

.judge-incorrect {
  border-color: #f56c6c !important;
  background: #fef0f0 !important;
}

.status-mark {
  position: absolute;
  right: 16px;
  color: #67c23a;
  font-size: 1.2em;
  font-weight: bold;
}

/* 解析面板 */
.explanation-panel {
  margin-top: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.hint-icon {
  color: #3b82f6;
  margin-right: 8px;
}

.panel-title {
  margin: 0;
  font-size: 0.95em;
  color: #1e293b;
}

.explanation-content {
  padding: 16px;
  margin: 0;
  background: white;
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 0.9em;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 过渡动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

.scale-fade-enter-active {
  transition: all 0.2s ease;
}

.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
</style>