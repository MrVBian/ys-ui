<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  id: String,
  score: {  // 修改为数组类型
    type: Array,
    default: () => []
  },
  question: String,
  correctAnswers: {
    type: Array,
    default: () => []
  },
  reveal: {
    type: Boolean,
    default: false
  },
  explanation: String
})

// 添加总分计算逻辑
const totalScore = computed(() => {
  return props.score.reduce((sum, num) => sum + num, 0)
})

const userAnswers = ref([])
const answerInputs = ref([])

// 拆分题干为文本段和填空段
const questionSegments = computed(() => {
  const segments = props.question.split(/_{3,}/g)
  const blanksCount = segments.length - 1
  return { segments, blanksCount }
})

// 答案状态计算
const answerStatus = computed(() => {
  return userAnswers.value.map((userAnswer, idx) => {
    const user = (userAnswer || '').trim().toLowerCase()
    const correct = (props.correctAnswers[idx] || '').trim().toLowerCase()
    
    console.log('对比结果:', {
      index: idx,
      userAnswer: user,
      correctAnswer: correct,
      isMatch: user === correct
    })
    
    return user === correct
  })
})

// 自动初始化答案数组
const initializeAnswers = () => {
  if (userAnswers.value.length !== questionSegments.value.blanksCount) {
    userAnswers.value = Array.from({ length: questionSegments.value.blanksCount }, () => '')
  }
}
initializeAnswers()


const adjustInputWidth = (el) => {
  const hiddenSpan = document.createElement('span')
  hiddenSpan.style.visibility = 'hidden'
  hiddenSpan.style.position = 'absolute'
  hiddenSpan.style.whiteSpace = 'pre'
  hiddenSpan.style.font = window.getComputedStyle(el).font
  hiddenSpan.textContent = el.value || el.placeholder
  
  document.body.appendChild(hiddenSpan)
  const width = hiddenSpan.offsetWidth + 4 // 增加少量边距
  document.body.removeChild(hiddenSpan)
  
  el.style.width = `${Math.min(Math.max(width, 100), 600)}px` // 设置最小和最大宽度
}

// 新增：输入事件处理
const handleInput = (e, index) => {
  adjustInputWidth(e.target)
  userAnswers.value[index] = e.target.value // 保持原有数据绑定
}
</script>

<template>
  <div class="choice-container">
    <div class="meta-info">
      <span class="question-id">
        <span>{{ id }}</span>
      </span>
      
      <span class="question-points">
        <svg class="star-icon" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z"/>
        </svg>
        <span>{{ totalScore }}</span>
      </span>
    </div>

    <h3 class="question-title">
      <template v-for="(segment, index) in questionSegments.segments" :key="index">
        <span class="segment-text">{{ segment }}</span>
        <template v-if="index < questionSegments.blanksCount">
          <div class="blank-container">
            <input
              v-model="userAnswers[index]"
              @input="handleInput($event, index)"
              ref="answerInputs"
              :class="{
                'correct': reveal && answerStatus[index],
                'incorrect': reveal && !answerStatus[index]
              }"
              class="blank-input"
              :readonly="reveal"
            />
            <span class="question-points">
              <span>{{ score[index] }}分</span>
            </span>
            <span 
              v-if="reveal && !answerStatus[index]" 
              class="correct-answer question-points"
            >
              {{ correctAnswers[index] || '[未配置答案]' }}
            </span>
          </div>
        </template>
      </template>
    </h3>

    <transition name="fade-slide">
      <div v-if="reveal && explanation" class="explanation-panel">
        <div class="panel-header">
          <svg class="hint-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
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
  font-family: 'Segoe UI', system-ui, sans-serif;
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

.question-id:hover, .question-points:hover {
  border-color: #ced4da;
  background: #fff;
}

.question-title {
  color: #303133;
  margin-bottom: 15px;
}

.segment-text {
  white-space: pre-wrap;
}

.blank-container {
  display: inline-flex;
  flex-direction: row;
  vertical-align: middle;
}

.correct-answer {
  color: #67c23a;
  white-space: nowrap;
}

.blank-input {
  width: 100px;
  margin: 0 4px;
  padding: 2px 4px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  vertical-align: middle;
  transition: all 0.3s;
}

.blank-input:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 4px rgba(64, 158, 255, 0.3);
  
}

.blank-input.correct {
  background-color: #f0fff3;
  border-color: #67c23a;
}

.blank-input.incorrect {
  background-color: #fff0f0;
  border-color: #f56c6c;
}

.explanation-panel {
  margin-top: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
  white-space: pre-wrap;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.choice-container {
  margin: 12px 0;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.3s;
}

.question-points {
  color: #2b8a3e;
}

.star-icon {
  color: #f59f00;
}
</style>