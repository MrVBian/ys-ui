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


  <!-- 功能展示区域 -->
  <div class="text-center mb-2">
    <h1 class="text-3xl font-bold mb-4">效果出众的图像增强</h1>
    <p class="text-lg text-gray-600 max-w-md mx-auto">
      采用先进 AI 算法，全面提升图像细节
    </p>
  </div>
  <div id="image-compare" class="w-full mb-16 md:w-1/2 mx-auto border rounded-lg overflow-hidden shadow-md" >
    <img src="/example/2.png"/>
    <img src="/example/1.jpg"/>
  </div>


  <!-- 教学步骤区域 -->
  <div class="text-center mb-2">
    <h1 class="text-3xl font-bold mb-4">使用步骤</h1>
    <p class="text-lg text-gray-600 max-w-md mx-auto">
      采用先进 AI 算法，全面提升图像细节
    </p>
  </div>
  <div class="flex flex-col mb-16 w-full md:w-1/3 mx-auto">
    <n-space vertical>
      <n-steps vertical>
        <n-step
          title="I Me Mine"
          description="All through the day, I me mine I me mine, I me mine"
        />
        <n-step
          title="Let It Be"
          description="When I find myself in times of trouble Mother Mary comes to me"
        />
        <n-step title="Break" />
        <n-step
          title="Come Together"
          description="Here come old flat top He come grooving up slowly"
        />
        <n-step
          title="Something"
          description="Something in the way she moves Attracts me like no other lover"
        />
      </n-steps>
    </n-space>
  </div>

  <!-- 常见问题区域 -->
  <div class="text-center mb-2">
    <h1 class="title text-3xl font-bold mb-4">常见问题解答</h1>
    <p class="text-lg text-gray-600 max-w-md mx-auto">
      采用先进 AI 算法，全面提升图像细节
    </p>
  </div>
  <div class="flex flex-col mb-16 w-full md:w-1/3 mx-auto" :scrollable="false">
      <n-collapse arrow-placement="right">
        <n-collapse-item title="如何创建新账户？" name="1">
          <div class="answer-content">
            <p>您可以通过以下步骤创建新账户：</p>
            <ol>
              <li>点击页面右上角的"注册"按钮</li>
              <li>填写您的邮箱地址和密码</li>
              <li>完成邮箱验证流程</li>
              <li>完善您的个人资料信息</li>
            </ol>
          </div>
        </n-collapse-item>
        <n-collapse-item title="忘记密码怎么办？" name="2">
          <div class="answer-content">
            <p>重置密码流程：</p>
            <ul>
              <li>在登录页面点击"忘记密码"</li>
              <li>输入您注册时使用的邮箱地址</li>
              <li>查收系统发送的密码重置邮件</li>
              <li>按照邮件中的指引设置新密码</li>
            </ul>
          </div>
        </n-collapse-item>
        <n-collapse-item title="如何修改个人资料？" name="3">
          <div class="answer-content">
            <p>个人资料修改步骤：</p>
            <ol>
              <li>登录您的账户</li>
              <li>点击右上角头像进入"个人中心"</li>
              <li>在"账户设置"中修改您的信息</li>
              <li>点击保存按钮确认修改</li>
            </ol>
          </div>
        </n-collapse-item>
      </n-collapse>
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



import { onMounted } from 'vue'
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import { MdArrowRoundBack, MdArrowRoundForward } from '@vicons/ionicons4'
// 导入图片对比库和样式
import ImageCompare from "image-compare-viewer";
import 'image-compare-viewer/dist/image-compare-viewer.min.css';


// 初始化图片比较器
onMounted(() => {
  const element = document.getElementById('image-compare')
  if (element) {
    new ImageCompare(element, {
      controlColor: "#FFFFFF",
      controlShadow: true,
      addCircle: true,
      showLabels: true,
      labelOptions: {
        before: '效果图',
        after: '原始图'
      }
    }).mount()
  }
})

</script>

<style scoped>
.image-processor {
  max-width: 1000px;
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

.title {
  text-align: center;
  color: #2d8cf0;
  margin-bottom: 30px;
}

.answer-content {
  padding: 5px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style>