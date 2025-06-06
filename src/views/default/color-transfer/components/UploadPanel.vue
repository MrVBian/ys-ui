<template>
  <div class="upload-container">
    <n-upload
      multiple
      directory-dnd
      :show-file-list="false"
      :custom-request="customRequest"
      @drop="handleDrop"
      @change="handleChange"
      @remove="handleRemove"
    >
      <n-upload-dragger class="upload-dragger">
        <div class="upload-content">
          <n-icon size="48" :depth="3">
            <CloudUploadOutline />
          </n-icon>
          <n-text depth="3" class="upload-text">
            点击或拖拽文件到此处上传
          </n-text>
          <n-text depth="3" class="upload-hint">
            支持图片文件(JPG, PNG, WEBP)和文件夹
          </n-text>
        </div>
      </n-upload-dragger>
    </n-upload>

    <n-alert v-if="uploadStatus" :type="uploadStatus.type" class="status-alert">
      {{ uploadStatus.message }}
    </n-alert>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { NUpload, NUploadDragger, NIcon, NText, NAlert } from 'naive-ui';
import { CloudUploadOutline } from '@vicons/ionicons5';

const emit = defineEmits(['file-added', 'file-removed']);
const uploadStatus = ref(null);

// 处理自定义上传请求
const customRequest = ({ file }) => {
  emit('file-added', file);
  
  // 模拟上传状态
  uploadStatus.value = {
    type: 'info',
    message: `正在上传: ${file.name}`
  };
  
  // 模拟上传成功
  setTimeout(() => {
    uploadStatus.value = {
      type: 'success',
      message: `${file.name} 上传成功!`
    };
  }, 1500);
};

// 处理拖拽事件
const handleDrop = (data) => {
  if (data.dataTransfer?.files.length) {
    Array.from(data.dataTransfer.files).forEach(file => {
      if (isImageFile(file)) {
        customRequest({ file });
      }
    });
  }
};

// 处理文件变化
const handleChange = (data) => {
  if (data.fileList?.length) {
    data.fileList.forEach(file => {
      if (isImageFile(file.file)) {
        customRequest({ file: file.file });
      }
    });
  }
};

// 处理文件移除
const handleRemove = (data) => {
  emit('file-removed', data.file.file);
};

// 检查是否为图片文件
const isImageFile = (file) => {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return acceptedTypes.includes(file.type);
};
</script>

<style scoped>
.upload-container {
  position: relative;
  padding: 24px;
  border-radius: 8px;
  background-color: rgba(250, 250, 252, 1);
  border: 2px dashed #e0e0e6;
  transition: border-color 0.3s;
}

.upload-dragger {
  padding: 40px 0;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.upload-text {
  font-size: 16px;
  font-weight: 500;
}

.upload-hint {
  font-size: 12px;
}

.status-alert {
  margin-top: 16px;
}

.upload-container:hover {
  border-color: #2080f0;
}
</style>