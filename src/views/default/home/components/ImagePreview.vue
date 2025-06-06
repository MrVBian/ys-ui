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
          :preview-src="image.url"
          object-fit="cover"
          class="thumbnail"
          preview-disabled
        />
        
        <div class="image-overlay">
          <n-button 
            circle
            size="small"
            type="error"
            @click="removeImage(index)"
            class="remove-btn"
          >
            <template #icon>
              <n-icon><TrashOutline /></n-icon>
            </template>
          </n-button>
          
          <n-button 
            circle
            size="small"
            type="primary"
            @click="previewImage(image.url)"
            class="view-btn"
          >
            <template #icon>
              <n-icon><EyeOutline /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>
    
    <n-modal v-model:show="showPreview">
      <n-image
        :src="currentPreview"
        :preview-src="currentPreview"
        object-fit="contain"
        class="full-preview"
      />
    </n-modal>


    

    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { NImage, NButton, NModal, NIcon, NText } from 'naive-ui';
import { EyeOutline, TrashOutline } from '@vicons/ionicons5';

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
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.remove-btn, .view-btn {
  --n-color: rgba(255, 255, 255, 0.8);
  --n-color-hover: rgb(255, 255, 255);
}


.full-preview {
  width: 100%;
  height: 100%;
  max-width: 90vw;
  max-height: 90vh;
}
</style>