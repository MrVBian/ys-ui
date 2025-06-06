<template>
  <n-space vertical>
    <!-- 图片上传 -->
    <n-upload
      :max="1"
      accept="image/*"
      :on-update:file-list="handleFileUpload"
      :show-file-list="false"
    >
      <n-button type="primary">上传图片</n-button>
    </n-upload>
    <div v-if="imageSrc" class="image-preview">
      <img :src="imageSrc" alt="上传的图片" ref="uploadedImage" />
    </div>

    <!-- 颜色选择 -->
    <div v-if="imageSrc" class="color-controls">
      <n-space>
        <div>
          <n-text>选择源颜色：</n-text>
          <n-color-picker v-model:value="sourceColor" />
        </div>
        <div>
          <n-text>选择目标颜色：</n-text>
          <n-color-picker v-model:value="targetColor" />
        </div>
      </n-space>
    </div>

    <!-- 下载按钮 -->
    <div v-if="imageSrc" class="actions">
      <n-button type="success" @click="downloadImage">下载处理后的图片</n-button>
    </div>

    <!-- Canvas 实现颜色替换 -->
    <canvas ref="canvas" style="display: none;"></canvas>
  </n-space>
</template>

<script>
import { ref, watch } from 'vue';
import { useMessage } from 'naive-ui';

export default {
  name: 'ImageColorReplacer',
  setup() {
    const message = useMessage();
    const imageSrc = ref(null); // 图片路径
    const sourceColor = ref('#000000'); // 源颜色
    const targetColor = ref('#ffffff'); // 目标颜色
    const canvas = ref(null); // Canvas 引用
    const uploadedImage = ref(null); // 上传的图片引用

    // 处理图片上传
    const handleFileUpload = async (fileList) => {
      if (fileList.length > 0) {
        const file = fileList[0].file;
        const reader = new FileReader();
        reader.onload = (e) => {
          imageSrc.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    // 监听颜色变化并实时更新图片
    watch([sourceColor, targetColor], () => {
      if (imageSrc.value) {
        processImage();
      }
    });

    // 替换图片颜色
    const processImage = () => {
      const canvasEl = canvas.value;
      const imgEl = uploadedImage.value;
      if (!canvasEl || !imgEl) return;

      const ctx = canvasEl.getContext('2d');
      const { width, height } = imgEl;
      canvasEl.width = width;
      canvasEl.height = height;

      // 绘制原始图片到 Canvas
      ctx.drawImage(imgEl, 0, 0, width, height);

      // 获取图片像素数据
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // 转换颜色
      const sourceRGB = hexToRgb(sourceColor.value);
      const targetRGB = hexToRgb(targetColor.value);

      for (let i = 0; i < data.length; i += 4) {
        if (
          data[i] === sourceRGB.r &&
          data[i + 1] === sourceRGB.g &&
          data[i + 2] === sourceRGB.b
        ) {
          data[i] = targetRGB.r; // 替换 R
          data[i + 1] = targetRGB.g; // 替换 G
          data[i + 2] = targetRGB.b; // 替换 B
        }
      }

      // 更新 Canvas
      ctx.putImageData(imageData, 0, 0);

      // 更新预览
      imageSrc.value = canvasEl.toDataURL();
    };

    // 下载图片
    const downloadImage = () => {
      const canvasEl = canvas.value;
      if (!canvasEl) return;

      const link = document.createElement('a');
      link.href = canvasEl.toDataURL('image/png');
      link.download = 'processed-image.png';
      link.click();

      message.success('图片已下载');
    };

    // 工具函数：将 HEX 转换为 RGB
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.replace('#', ''), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };

    return {
      imageSrc,
      sourceColor,
      targetColor,
      handleFileUpload,
      downloadImage,
      canvas,
      uploadedImage,
    };
  },
};
</script>

<style scoped>
.image-preview {
  margin-top: 1rem;
  max-width: 100%;
  text-align: center;
}
.image-preview img {
  max-width: 100%;
  height: auto;
}
.color-controls {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
.actions {
  margin-top: 1rem;
  text-align: center;
}
</style>