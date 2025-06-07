<template>
  <div class="preview-container">
    <div v-if="!imageList.length" class="empty-prompt">
      <n-text depth="3">暂无图片，请先上传</n-text>
    </div>
    
    <!-- 使用NImageGroup实现原生预览功能 -->
    <n-image-group show-toolbar>
      <div class="image-grid">
        <div 
          v-for="(image, index) in imageList" 
          :key="image.id" 
          class="image-item"
        >
          <!-- 启用原生预览功能 -->
          <n-image
            :src="image.url"
            :preview-src="image.url"
            :fallback-src="fallbackImage"
            object-fit="cover"
            class="responsive-image"
            :show-toolbar="false"
            :intersection-observer-options="{ root: '.image-grid' }"
            @error="handleImageError(index)"
          >
            <template #placeholder>
              <div class="loading-spinner">
                <n-spin size="small" />
              </div>
            </template>
            
            <template #error>
              <div class="image-error">
                <n-icon size="24" color="#ff4d4f"><WarningOutline /></n-icon>
                <span>加载失败</span>
              </div>
            </template>
          </n-image>
          
          <div class="image-overlay">
            <div class="btn-group">
              <!-- 优化删除按钮位置和交互 -->
              <n-button 
                circle
                size="small"
                type="error"
                @click.stop="removeImage(index)"
                class="action-btn"
                title="删除图片"
              >
                <template #icon>
                  <n-icon><TrashOutline /></n-icon>
                </template>
              </n-button>
              
              <!-- 添加预览计数标识 -->
              <div class="view-indicator">
                <n-icon size="12"><EyeOutline /></n-icon>
                <span>{{ index + 1 }}/{{ imageList.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-image-group>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { NImage, NButton, NIcon, NText, NImageGroup, NSpin } from 'naive-ui';
import { EyeOutline, TrashOutline, WarningOutline } from '@vicons/ionicons5';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['remove-image', 'image-error']);

const fallbackImage = ref('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="100" viewBox="0 0 120 100"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23aaa" font-family="sans-serif" font-size="10">图片加载失败</text></svg>');

const imageList = computed(() => {
  return props.images.map((image, idx) => ({
    ...image,
    id: image.id || `${Date.now()}-${idx}`
  }));
});

const handleImageError = (index) => {
  emit('image-error', { index, url: imageList.value[index].url });
};

const removeImage = (index) => {
  window.$dialog?.warning({
    title: '确认删除',
    content: '确定要删除这张图片吗？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      emit('remove-image', index);
    }
  });
};
</script>

<style scoped>
.preview-container {
  margin-top: 24px;
  min-height: 200px;
  position: relative;
}

.empty-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 1px dashed #e0e0e6;
  border-radius: 8px;
  background-color: #fafafa;
  transition: border-color 0.3s;
}

.empty-prompt:hover {
  border-color: #2080f0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.image-item {
  position: relative;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f0f0f0;
}

.responsive-image {
  width: 100%;
  height: 100%;
  object-fit: cover;   /* 保持图片比例，裁剪多余部分 */
  object-position: center; /* 关键：确保图片在容器中居中 */
}


.image-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.image-error {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ff4d4f;
  font-size: 12px;
  background: #f0f0f0;
  padding: 0 8px;
  text-align: center;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%);
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
  transform: translateY(0);
}

.btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.action-btn {
  --n-color: white;
  --n-color-hover: #f02020;
  --n-color-pressed: #c91010;
  --n-color-focus: #f02020;
  --n-ripple-color: rgba(255, 255, 255, 0.2);
  --n-text-color: #f02020;
  --n-border: none;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.view-indicator {
  display: flex;
  align-items: center;
  background: rgba(0,0,0,0.5);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  backdrop-filter: blur(4px);
}

.view-indicator span {
  margin-left: 4px;
}

.image-name {
  color: white;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 2px 4px;
  background: rgba(0,0,0,0.4);
  border-radius: 4px;
}

.loading-spinner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.8);
}

</style>