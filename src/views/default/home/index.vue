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
          <h1 class="text-3xl font-bold mb-4">效果出众的图像增强</h1>
          <p class="text-lg text-gray-600 max-w-md mx-auto">
            采用先进 AI 算法，全面提升图像细节
          </p>
        </div>

        <div>

          <n-layout class="min-h-screen">
            <n-layout-header bordered class="h-20 bg-[#18a058] flex items-center">
              <div class="container mx-auto px-4">
                <n-h1 class="text-white">常见问题解答</n-h1>
              </div>
            </n-layout-header>

            <n-layout-content class="py-8">
              <div class="container mx-auto px-4">
                <n-collapse arrow-placement="right" accordion>
                  <n-collapse-item
                    v-for="(faq, index) in faqs"
                    :key="index"
                    :title="faq.question"
                    :name="index"
                  >
                    <div class="faq-answer px-4 py-3 bg-[#f0f9eb] rounded">
                      {{ faq.answer }}
                    </div>
                  </n-collapse-item>
                </n-collapse>

                <div class="mt-12 bg-[#f5f7fa] p-6 rounded-lg shadow-sm">
                  <n-h3 class="mb-4 text-[#18a058]">找不到答案？</n-h3>
                  <n-space vertical>
                    <n-input v-model:value="newQuestion" type="textarea" placeholder="请描述您的问题..." rows="3" />
                    <n-button type="primary" @click="submitQuestion">提交问题</n-button>
                  </n-space>
                </div>
              </div>
            </n-layout-content>

            <n-layout-footer bordered class="py-6 bg-gray-100">
              <div class="container mx-auto px-4 text-center text-gray-500">
                Copyright © 2023 问题解答中心 | 我们随时为您服务
              </div>
            </n-layout-footer>
          </n-layout>

        </div>


      </div>
    </n-grid-item>
  </n-grid>

</template>
