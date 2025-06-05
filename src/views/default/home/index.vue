<script lang="ts">

import { defineComponent, ref, onMounted } from 'vue'

import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'

import type { StepsProps } from 'naive-ui'
import { MdArrowRoundBack, MdArrowRoundForward } from '@vicons/ionicons4'

// 导入图片对比库和样式
import ImageCompare from "image-compare-viewer";
import 'image-compare-viewer/dist/image-compare-viewer.min.css';


export default defineComponent({
  components: {
    MdArrowRoundBack,
    MdArrowRoundForward,
    ArchiveIcon,
  },
  setup() {
    const currentRef = ref<number | null>(1)
    
    // 初始化图片比较器
    onMounted(() => {
      const element = document.getElementById('image-compare');
      if (element) {
        new ImageCompare(element, {
          // 在这里添加配置选项（可选）
          controlColor: "#FFFFFF",
          controlShadow: true,
          addCircle: true,
          showLabels: true,
          labelOptions: {
            before: '原始图',
            after: '优化图',
          }
        }).mount();
      }
    });


    return {
      currentStatus: ref<StepsProps['status']>('process'),
      current: currentRef,
      next() {
        if (currentRef.value === null)
          currentRef.value = 1
        else if (currentRef.value >= 4)
          currentRef.value = null
        else currentRef.value++
      },
      prev() {
        if (currentRef.value === 0)
          currentRef.value = null
        else if (currentRef.value === null)
          currentRef.value = 4
        else currentRef.value--
      }
    }
  }
})



</script>

<template>
  <!-- <n-grid :cols="5" item-responsive :x-gap="10" :y-gap="10">
    <n-grid-item span="5 1130:3">
      <div flex="~ col" mb--10px>
        <my-suspense>
          <carousel mb-10px />
        </my-suspense>
        <recent-contest mb-10px />
        <newest-problem mb-10px />
        <my-suspense aspect-ratio="5/2">
          <Recent30DaysChart mb-10px />
        </my-suspense>
      </div>
    </n-grid-item>
    <n-grid-item span="5 1130:2">
      <div flex="~ col" mb--10px>
        <search-problem mb-10px />
        <announcement mb-10px />
        <rating-rank mb-10px />
      </div>
    </n-grid-item>
  </n-grid> -->

  <n-grid :cols="2" item-responsive :x-gap="10" :y-gap="10">
    <n-grid-item span="2">
      <div flex="~ col">
        <!-- 标题区域 -->
        <div class="text-center mb-2">
          <h1 class="text-3xl font-bold mb-4">AI 图像增强</h1>
          <p class="text-lg text-gray-600 max-w-md mx-auto">
            基于业界领先的 AI 模型，提升您的图像质量
          </p>
        </div>

        <!-- 上传区域 -->
        <div class="flex flex-col mb-16 w-full md:w-1/2 mx-auto">
          <n-upload
              multiple
              directory-dnd
              action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <ArchiveIcon />
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                点击或者拖动文件到该区域来上传
              </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
              </n-p>
            </n-upload-dragger>
          </n-upload>
        </div>


        <!-- 功能介绍区域 -->
        <div class="text-center mb-2">
          <h1 class="text-3xl font-bold mb-4">效果出众的图像增强</h1>
          <p class="text-lg text-gray-600 max-w-md mx-auto">
            采用先进 AI 算法，全面提升图像细节
          </p>
        </div>
        <div id="image-compare" class="w-full mb-16 md:w-1/2 mx-auto border rounded-lg overflow-hidden shadow-md" >
          <img src="/example/1.jpg"/>
          <img src="/example/2.jpg"/>
        </div>



        <!-- 常见问题区域 -->
        <div class="text-center mb-2">
          <h1 class="title text-3xl font-bold mb-4">常见问题解答</h1>
          <p class="text-lg text-gray-600 max-w-md mx-auto">
            采用先进 AI 算法，全面提升图像细节
          </p>
        </div>
        <div>
          <n-layout class="faq-container">
            <n-layout-content class="content">
              <n-collapse accordion arrow-placement="right" class="faq-list">
                <!-- 问题 1 -->
                <n-collapse-item title="如何创建新账户?" name="1">
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

                <!-- 问题 2 -->
                <n-collapse-item title="忘记密码怎么办?" name="2">
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

                <!-- 问题 3 -->
                <n-collapse-item title="如何修改个人资料?" name="3">
                  <div class="answer-content">
                    <n-alert type="info" class="note-box">
                      重要提示：邮箱修改需要验证新地址
                    </n-alert>
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
            </n-layout-content>
          </n-layout>
        </div>


      </div>
    </n-grid-item>
  </n-grid>

</template>

<style scoped>
.faq-container {
  max-width: 45%;
  margin: 0px auto;
  padding: 0 20px;
}

.content {
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #2d8cf0;
  margin-bottom: 30px;
}

.faq-list {
  margin-top: 20px;
}

.answer-content {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.note-box {
  margin-bottom: 15px;
}
</style>