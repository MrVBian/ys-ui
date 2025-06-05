<script setup>
import { ref } from 'vue'

defineProps({
  questions: { // 修正为接收 questions 数组
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => {
      return value.every(q => 'id' in q && 'title' in q && 'score' in q && 'passNum' in q && 'totalNum' in q)
    }
  }
})

const getPercent = (passNum, totalNum) => {
  if (totalNum === 0) return 0
  return ((passNum / totalNum) * 100).toFixed(2)
}

</script>


<template>
    <div class="question-list-container">
        <table class="question-table">
            <thead>
                <tr>
                    <th>题号</th>
                    <th>标题</th>
                    <th>分数</th>
                    <th>通过率</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="q in questions" :key="q.id" class="question-row">
                    <td>{{ q.id }}</td>
                    <td>{{ q.title }}</td>
                    <td>{{ q.score }}</td>
                    <td>
                        <div class="progress-container">
                            <span>
                                {{ q.passNum }}/{{ q.totalNum }}({{ getPercent(q.passNum, q.totalNum) }}%)
                            </span>
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: getPercent(q.passNum, q.totalNum) + '%' }"></div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.question-list-container {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.question-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

th,
td {
    padding: 16px 16px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
}

th {
    background-color: #f8f9fa;
    font-weight: 600;
}

.question-row {
    cursor: pointer;
    transition: background-color 0.2s;
}

.question-row:hover {
    background-color: #f5f7fa;
}

.progress-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}


.progress-bar {
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: #4caf50;
    border-radius: 4px;
    transition: width 0.3s ease;
}
</style>