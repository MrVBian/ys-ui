<template>
  <div class="historical-works-container">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <n-space justify="space-between" align="center" style="width: 100%">
        <n-space>
          <n-date-picker
            v-model:value="dateRange"
            type="daterange"
            clearable
            :start-placeholder="startPlaceholder"
            :end-placeholder="endPlaceholder"
            @update:value="filterWorks"
            :style="{ width: '300px' }"
          />
          <n-button @click="resetFilters" secondary>
            <template #icon>
              <n-icon><refresh-icon /></n-icon>
            </template>
            重置
          </n-button>
        </n-space>
        <n-tag :bordered="false" type="info">
          共 {{ filteredWorks.length }} 件作品
        </n-tag>
      </n-space>
    </div>

    <!-- 分组展示作品 -->
    <div class="works-container">
      <div v-if="groupedWorks.length === 0" class="no-works-tip">
        <n-empty description="未找到符合条件的历史作品">
          <template #icon>
            <n-icon style="font-size: 8em; color: #e8e8e8">
              <image-icon />
            </n-icon>
          </template>
        </n-empty>
      </div>

      <!-- 按日期分组的作品 -->
      <div v-for="(group, index) in groupedWorks" :key="index" class="date-group">
        <n-h2 prefix="bar">{{ formatDate(group.date) }}</n-h2>
        <n-grid :cols="columnCount" :x-gap="16" :y-gap="20" responsive="screen">
          <n-gi v-for="work in group.works" :key="work.id" class="work-item">
            <div class="work-card">
              <div class="work-image">
                <n-image
                  :src="work.imageUrl"
                  :alt="work.title"
                  object-fit="cover"
                  height="200"
                />
              </div>
              <div class="tag-overlay">
                <n-tag class="enhanced-tag" :type="tagTypeMap[work.tag]" :bordered="false">
                  {{ tagMap[work.tag] }}
                </n-tag>
              </div>
              <div class="work-time">
                {{ formatTime(work.createdAt) }}
              </div>
            </div>
          </n-gi>
        </n-grid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  NGrid, 
  NGi, 
  NImage, 
  NDatePicker, 
  NButton, 
  NTag, 
  NH2, 
  NSpace,
  NIcon,
  NEmpty
} from 'naive-ui'
import { Refresh as RefreshIcon, Image as ImageIcon } from '@vicons/ionicons5'

// 标签枚举值映射
const tagMap = {
  enhance: '图像增强',
  removeTexture: '底纹去除',
  extractAndTile: '图案提取与平铺',
  generate: '图像生成',
  colorTransfer: '色彩迁移与调色',
  depthEstimation: '平面图转立体图'
}

// 标签类型映射
const tagTypeMap = {
  enhance: 'info',
  removeTexture: 'success',
  extractAndTile: 'warning',
  generate: 'error',
  colorTransfer: 'primary',
  depthEstimation: 'tertiary'
}

// 日期范围
const dateRange = ref(null)
const startPlaceholder = ref("开始日期")
const endPlaceholder = ref("结束日期")

// 作品数据（模拟）
const mockWorks = ref([])
const filteredWorks = ref([])

// 分组作品数据
const groupedWorks = computed(() => {
  const groups = {}
  
  filteredWorks.value.forEach(work => {
    const date = new Date(work.createdAt)
    // 只取日期部分（忽略时间）
    const dateStr = date.toISOString().split('T')[0]
    
    if (!groups[dateStr]) {
      groups[dateStr] = {
        date: dateStr,
        works: []
      }
    }
    
    groups[dateStr].works.push(work)
  })
  
  // 转换为数组并按日期降序排列
  return Object.values(groups)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

// 根据屏幕宽度动态调整列数
const columnCount = computed(() => {
  const width = window.innerWidth
  if (width < 768) return 2
  if (width < 1024) return 3
  if (width < 1400) return 4
  return 5
})

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  const options = { month: 'long', day: 'numeric' }
  const dateText = date.toLocaleDateString('zh-CN', options)
  
  if (date.toDateString() === today.toDateString()) {
    return `今天 - ${dateText}`
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `昨天 - ${dateText}`
  } else {
    const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
    return `${weekday} - ${dateText}`
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })
}

// 筛选作品
const filterWorks = () => {
  if (!dateRange.value) {
    filteredWorks.value = [...mockWorks.value]
    return
  }
  
  const [startTs, endTs] = dateRange.value
  const startDate = startTs ? new Date(startTs) : null
  const endDate = endTs ? new Date(endTs) : null
  
  if (!startDate && !endDate) {
    filteredWorks.value = [...mockWorks.value]
    return
  }
  
  // 调整时区，只比较日期部分
  const getDatePart = (timestamp) => {
    const date = new Date(timestamp)
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  
  filteredWorks.value = mockWorks.value.filter(work => {
    const workDate = getDatePart(work.createdAt)
    
    let inRange = true
    
    if (startDate) {
      const compDate = getDatePart(startDate.getTime())
      inRange = inRange && workDate >= compDate
    }
    
    if (endDate) {
      const compDate = getDatePart(endDate.getTime())
      inRange = inRange && workDate <= compDate
    }
    
    return inRange
  })
}

// 重置筛选
const resetFilters = () => {
  dateRange.value = null
  filteredWorks.value = [...mockWorks.value]
}

// 生成模拟作品数据
const generateMockWorks = () => {
  const types = Object.keys(tagMap)
  const images = [
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel5.jpeg',
  ]
  
  const works = []
  
  // 生成100个作品，分布在最近7天内
  for (let i = 0; i < 100; i++) {
    // 随机日期：最近7天
    const daysAgo = Math.floor(Math.random() * 7)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    
    // 随机时间
    const hours = Math.floor(Math.random() * 24)
    const minutes = Math.floor(Math.random() * 60)
    date.setHours(hours, minutes)
    
    // 随机类型
    const randomType = types[Math.floor(Math.random() * types.length)]
    
    // 随机图片
    const randomImage = images[Math.floor(Math.random() * images.length)]
    
    works.push({
      id: i + 1,
      title: `作品 ${i + 1}`,
      tag: randomType,
      imageUrl: randomImage,
      createdAt: date.getTime()
    })
  }
  
  mockWorks.value = works
  filteredWorks.value = [...works]
}

onMounted(() => {
  generateMockWorks()
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    // 触发响应式更新
  });
})
</script>

<style scoped>
.historical-works-container {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.filter-section {
  margin-bottom: 30px;
  padding: 16px 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.date-group {
  margin-bottom: 40px;
}

.work-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.work-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.work-image {
  position: relative;
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.tag-overlay {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}

.enhanced-tag {
  /* 半透明白色背景增加可读性 */
  background-color: rgba(255, 255, 255, 0.85) !important;
  
  /* 深色文字与背景形成对比 */
  color: rgba(0, 0, 0, 0.85) !important;
  
  /* 添加阴影增强立体感和可读性 */
  box-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.15),
    0 1px 2px rgba(0, 0, 0, 0.3) !important;
  
  /* 增大字号和字重 */
  font-size: 14px;
  font-weight: 600;
  
  /* 增加内边距使标签更醒目 */
  padding: 0 12px !important;
  
  /* 圆角微调 */
  border-radius: 14px !important;
  
  /* 添加白色描边增强与背景的分离感 */
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  
  /* 防止文字被裁剪 */
  line-height: 1.5;
  height: auto;
  min-height: 28px;
}

.work-time {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 12px;
  color: white;
  background-color: rgba(0,0,0,0.5);
  padding: 2px 8px;
  border-radius: 4px;
  z-index: 10;
}

.no-works-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  flex-direction: column;
  text-align: center;
}

@media (max-width: 768px) {
  .historical-works-container {
    padding: 10px;
  }
  
  .filter-section {
    padding: 12px;
  }
  
  .tag-overlay {
    bottom: 5px;
    right: 5px;
  }
  
  .work-time {
    bottom: 5px;
    left: 5px;
  }
}
</style>