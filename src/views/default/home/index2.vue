<template>
  <div class="image-processor">
    <n-card title="图片处理中心" class="main-card">
      <upload-panel @file-added="addImage" @file-removed="removeImageByName" />
      
      <image-preview 
        :images="originalImages" 
        @remove-image="removeImageByIndex" 
        class="preview-section"
      />
      
      <parameter-panel 
        :images="originalImages" 
        :has-images="originalImages.length > 0"
        @process-images="handleProcessedImages"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { NCard } from 'naive-ui';
import { UploadPanel, ImagePreview, ParameterPanel } from "./components";

// 上传的原始图片
const originalImages = ref([]);
// 处理后的图片
const processedImages = ref([]);

// 添加图片
const addImage = (file) => {
  // 创建预览URL
  const url = URL.createObjectURL(file);
  
  originalImages.value.push({
    name: file.name,
    size: file.size,
    type: file.type,
    url,
    file // 保留原始文件对象
  });
};

// 根据索引移除图片
const removeImageByIndex = (index) => {
  URL.revokeObjectURL(originalImages.value[index].url);
  originalImages.value.splice(index, 1);
};

// 根据文件名移除图片
const removeImageByName = (file) => {
  const index = originalImages.value.findIndex(img => img.name === file.name);
  if (index !== -1) {
    URL.revokeObjectURL(originalImages.value[index].url);
    originalImages.value.splice(index, 1);
  }
};

// 处理完成的图片
const handleProcessedImages = (images) => {
  processedImages.value = images;
};
</script>

<style scoped>
.image-processor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.main-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.preview-section {
  margin: 32px 0;
}
</style>