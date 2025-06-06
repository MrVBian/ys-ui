<template>
  <div class="parameter-panel" :class="{ visible: hasImages }">
    <n-divider />
    
    <n-space vertical>
      <n-h3>图片处理参数</n-h3>
      
      <n-grid :cols="2" :x-gap="24">
        <n-gi>
          <n-form-item label="处理强度：" path="intensity">
            <n-slider
              v-model:value="params.intensity"
              :min="1"
              :max="10"
              :step="1"
            />
            <n-text class="slider-value">{{ params.intensity }}</n-text>
          </n-form-item>
        </n-gi>
        
        <n-gi>
          <n-form-item label="缩放比例：">
            <n-select
              v-model:value="params.scale"
              :options="[
                { label: '保持原图', value: 'original' },
                { label: '50%', value: 0.5 },
                { label: '75%', value: 0.75 },
                { label: '90%', value: 0.9 },
                { label: '125%', value: 1.25 },
                { label: '150%', value: 1.5 }
              ]"
            />
          </n-form-item>
        </n-gi>
      </n-grid>
      
      <n-space>
        <n-button 
          type="primary" 
          @click="processImages" 
          :loading="processing"
        >
          <template #icon>
            <n-icon><HammerOutline /></n-icon>
          </template>
          批量处理
        </n-button>
        
        <n-button 
          type="success" 
          :disabled="!processedImages.length"
          @click="downloadAll"
        >
          <template #icon>
            <n-icon><DownloadOutline /></n-icon>
          </template>
          打包下载全部
        </n-button>
      </n-space>
    </n-space>
    
    <div v-if="processedImages.length" class="results-section">
      <n-divider />
      <n-h3>处理结果</n-h3>
      
      <div class="result-grid">
        <div v-for="(image, index) in processedImages" :key="index" class="result-item">
          <n-image
            :src="image.url"
            object-fit="cover"
            class="result-thumbnail"
          />
          <n-button
            circle
            type="primary"
            size="small"
            @click="downloadSingle(image)"
            class="download-btn"
          >
            <template #icon>
              <n-icon><DownloadOutline /></n-icon>
            </template>
          </n-button>
          <n-tag :bordered="false" type="info" size="small" class="size-tag">
            {{ formatSize(image.size) }}
          </n-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  NDivider, 
  NH3, 
  NSpace, 
  NButton, 
  NIcon, 
  NGrid, 
  NGi, 
  NFormItem, 
  NSelect, 
  NSlider, 
  NText,
  NImage,
  NTag
} from 'naive-ui';
import { HammerOutline, DownloadOutline } from '@vicons/ionicons5';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  hasImages: Boolean
});

const emit = defineEmits(['process-images']);

const params = ref({
  intensity: 5,
  scale: 'original'
});

const processedImages = ref([]);
const processing = ref(false);

// 处理图片
const processImages = () => {
  processing.value = true;
  processedImages.value = [];
  
  // 模拟处理延迟
  setTimeout(() => {
    // 模拟处理结果 - 实际项目中会调用图片处理API
    processedImages.value = props.images.map((image, index) => {
      // 这里应替换为实际的图片处理逻辑
      return {
        ...image,
        name: `processed-${image.name}`,
        url: image.url // 实际场景中会替换为处理后的URL
      };
    });
    
    processing.value = false;
    emit('process-images', processedImages.value);
  }, 2000);
};

// 下载单个文件
const downloadSingle = (image) => {
  const link = document.createElement('a');
  link.href = image.url;
  link.download = image.name;
  link.click();
};

// 打包下载所有文件
const downloadAll = () => {
  // 实际项目中会使用JSZip生成zip包
  alert(`开始打包下载${processedImages.value.length}个文件...`);
  // 这里添加实际打包下载逻辑
};

// 格式化文件大小
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped>
.parameter-panel {
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s ease;
}

.parameter-panel.visible {
  max-height: 1000px;
  margin-top: 24px;
  padding: 24px;
  border-radius: 8px;
  background: #fafafa;
  border: 1px solid #e0e0e6;
}

.slider-value {
  display: inline-block;
  min-width: 30px;
  text-align: right;
  margin-left: 12px;
  color: #2080f0;
  font-weight: bold;
}

.results-section {
  margin-top: 24px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.result-item {
  position: relative;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.result-thumbnail {
  width: 100%;
  height: 100%;
}

.download-btn {
  position: absolute;
  bottom: 4px;
  right: 4px;
  --n-color: white;
  --n-color-hover: rgb(0, 255, 76);
  --n-color-pressed: rgb(255, 0, 0);
  --n-color-focus: #2080f0;
  --n-ripple-color: rgba(255, 255, 255, 0.2);
  --n-text-color: #2080f0;
  --n-border: none;
}

.size-tag {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-weight: bold;
}
</style>