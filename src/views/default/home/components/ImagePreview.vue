<template>
  <div class="preview-container">
    <div v-if="!imageList.length" class="empty-prompt">
      <n-text depth="3">暂无图片，请先上传</n-text>
    </div>
    
    <div v-else class="image-grid">
      <div 
        v-for="(image, index) in imageList" 
        :key="image.id" 
        class="image-item"
      >
        <n-image
          :src="image.url"
          object-fit="cover"
          class="thumbnail"
          preview-disabled
          @click="previewImage(image.url)"
        />
        
        <div class="image-overlay">
          <n-button 
            circle
            size="small"
            type="error"
            @click.stop="removeImage(index)"
            class="remove-btn"
          >
            <template #icon>
              <n-icon><TrashOutline /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>
    
    <n-image-preview
      v-model:show="showPreview"
      :show-toolbar="true"
      :image-props="{ objectFit: 'contain' }"
      :theme-overrides="previewTheme"
    >
      <template #toolbar="{ node, index }">
        <div class="preview-toolbar">
          <n-icon size="20" :color="previewTheme.toolbarColor" class="toolbar-icon">
            <ArrowExpandOutline />
          </n-icon>
          <span class="preview-counter">{{ index + 1 }} / {{ imageList.length }}</span>
          <n-icon 
            size="20" 
            :color="previewTheme.toolbarColor" 
            class="toolbar-icon close-icon"
            @click="showPreview = false"
          >
            <CloseOutline />
          </n-icon>
        </div>
      </template>
    </n-image-preview>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { NImage, NButton, NImagePreview, NIcon, NText } from 'naive-ui';
import { TrashOutline, ArrowExpandOutline, CloseOutline } from '@vicons/ionicons5';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['remove-image']);
const showPreview = ref(false);
const currentPreview = ref('');

const imageList = computed(() => {
  return props.images.map((image, idx) => ({
    ...image,
    id: `${Date.now()}-${idx}`
  }));
});

const previewTheme = ref({
  iconColor: 'rgba(255,255,255,0.9)',
  toolbarColor: 'rgba(255,255,255,0.9)',
  toolbarBoxShadow: '0px 4px 12px rgba(0,0,0,0.4)',
  toolbarBorderRadius: '12px',
  toolbarBackgroundColor: 'rgba(40,40,40,0.8)',
  zIndex: 1000
});

const previewImage = (url) => {
  currentPreview.value = url;
  showPreview.value = true;
};

const removeImage = (index) => {
  emit('remove-image', index);
};
</script>

<style scoped>
.preview-container {
  margin-top: 24px;
  min-height: 200px;
}

.empty-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 1px dashed #e0e6e1;
  border-radius: 8px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.image-item {
  position: relative;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
}

.image-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s;
}

.remove-btn {
  --n-icon-size: 16px;
  --n-color: rgba(255, 255, 255, 0.9);
  --n-color-pressed: #fff;
  --n-color-focus: #fff;
  --n-color-hover: #fff;
  background-color: rgba(220, 53, 69, 0.85);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.remove-btn:hover {
  background-color: rgba(220, 53, 69, 1);
  transform: scale(1.1);
}

.preview-toolbar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
}

.preview-counter {
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  font-weight: 500;
}

.toolbar-icon {
  transition: all 0.3s;
  cursor: pointer;
}

.toolbar-icon:hover {
  transform: scale(1.15);
}

.close-icon:hover {
  color: #ff6b6b;
}
</style>