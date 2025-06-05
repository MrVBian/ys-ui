<script setup>
import { ref } from "vue";
const props = defineProps({
  id: String,
  score: Number,
  question: String,
  options: Array,
  correctIndices: {
    type: Array,
    default: () => [],
    validator: (value) => value.every((i) => typeof i === "number"),
  },
  reveal: {
    type: Boolean,
    default: false,
  },
  explanation: String,
});

const selectedIndices = ref(new Set());

const selectOption = (index) => {
  if (!props.reveal) {
    const newSelected = new Set(selectedIndices.value);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    selectedIndices.value = newSelected;
  }
};
</script>

<template>
  <div class="choice-container">
    <div class="meta-info">
      <span class="question-id">
        <span>{{ id }}</span>
      </span>

      <span class="question-points">
        <svg class="star-icon" viewBox="0 0 24 24" width="16" height="16">
          <path
            fill="currentColor"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z"
          />
        </svg>
        <span>{{ score }}</span>
      </span>
    </div>
    <h3 class="question-title">{{ question }}</h3>
    <div class="options-list">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="option-item"
        :class="{
          selected: selectedIndices.has(index) && !reveal,
          'correct-selected':
            reveal &&
            correctIndices.includes(index) &&
            selectedIndices.has(index),
          'correct-unselected':
            reveal &&
            correctIndices.includes(index) &&
            !selectedIndices.has(index),
          'incorrect-selected':
            reveal &&
            !correctIndices.includes(index) &&
            selectedIndices.has(index),
        }"
        @click="selectOption(index)"
      >
        <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
        <pre class="code-option">{{ option }}</pre>
        <span v-if="reveal" class="status-mark">
          <template v-if="correctIndices.includes(index)">
            <span
              v-if="selectedIndices.has(index)"
              class="correct-selected-mark"
              >✓</span
            >
            <span v-else class="correct-unselected-mark">!</span>
          </template>
          <span
            v-else-if="selectedIndices.has(index)"
            class="incorrect-selected-mark"
            >✗</span
          >
        </span>
      </div>
    </div>

    <transition name="fade-slide">
      <div v-if="reveal && explanation" class="explanation-panel">
        <div class="panel-header">
          <svg class="hint-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
            />
          </svg>
          <h4 class="panel-title">题目解析</h4>
        </div>
        <div class="explanation-content">
          <pre>{{ explanation }}</pre>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.meta-info {
  display: flex;
  gap: 1rem;
  margin-bottom: -0.5rem;
  font-family: "Segoe UI", system-ui, sans-serif;
}

.question-id,
.question-points {
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

.question-id:hover,
.question-points:hover {
  border-color: #ced4da;
  background: #fff;
}

.id-icon,
.star-icon {
  opacity: 0.8;
}

.question-points {
  color: #2b8a3e;
  background: #f8f9fa;
  border-color: #e9ecef;
}

.star-icon {
  color: #f59f00;
}

.choice-container {
  margin: 12px 0;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.3s;
}

.question-title {
  color: #303133;
  margin-bottom: 15px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.option-item {
  position: relative;
  padding: 6px 20px;
  border: 2px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  background: white;
}

.option-item:hover {
  background-color: #f5f7fa;
}

.selected {
  border-color: #409eff;
}

.correct {
  background-color: #f0f9eb !important;
  border-color: #67c23a !important;
}

.incorrect {
  background-color: #fef0f0 !important;
  border-color: #f56c6c !important;
}

.option-label {
  font-weight: bold;
  margin-right: 10px;
  color: #606266;
}

.code-option {
  margin: 0;
  font-family: Consolas, monospace;
  white-space: pre-wrap;
}

.correct-mark {
  position: absolute;
  right: 15px;
  color: #67c23a;
  font-size: 1.2em;
}

.explanation-panel {
  margin-top: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.hint-icon {
  color: #3b82f6;
  margin-right: 10px;
}

.panel-title {
  margin: 0;
  color: #1e293b;
  font-size: 15px;
  font-weight: 600;
}

.explanation-content {
  padding: 16px;
  background: white;
}

.explanation-content pre {
  margin: 0;
  font-family: "SF Mono", Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
  white-space: pre-wrap;
}

/* 添加过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 微调容器间距 */
.choice-container {
  margin: 16px 0;
  padding: 16px;
  border-radius: 8px;
}

.reveal-mode .option-item {
  cursor: default;
}

/* 正确且选中 */
.correct-selected {
  background-color: #e8f5e9 !important;
  border: 2px solid #4caf50 !important;
  animation: pulse-correct 0.5s;
}

/* 正确但未选中 */
.correct-unselected {
  background-color: #f8f9fa !important;
  border: 2px dashed #4caf50 !important;
  position: relative;
}

/* 错误且选中 */
.incorrect-selected {
  background-color: #ffebee !important;
  border: 2px solid #ff5252 !important;
  animation: shake 0.5s;
}

.status-mark {
  position: absolute;
  right: 15px;
  font-size: 1.2em;
  font-weight: bold;
}

.correct-selected-mark {
  color: #4caf50;
}

.correct-unselected-mark {
  color: #4caf50;
  border: 1px solid currentColor;
  border-radius: 50%;
  padding: 0 4px;
  font-size: 0.9em;
}

.incorrect-selected-mark {
  color: #ff5252;
}

/* 调整悬停效果 */
.option-item:not(
    .correct-selected,
    .correct-unselected,
    .incorrect-selected
  ):hover {
  background-color: #f5f7fa;
}
</style>
