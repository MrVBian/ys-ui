<!-- UserProfile.vue 个人信息组件 -->
<template>
  <n-card title="个人信息" class="shadow-lg rounded-2xl">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- 可点击修改的头像 - 样式优化 -->
      <div 
        class="relative self-center cursor-pointer group"
        @click="openAvatarEditor"
      >
        <n-avatar
          round
          :size="128"
          :src="avatarUrl"
          class="ring-2 ring-gray-200 transition-all duration-300 group-hover:ring-indigo-500"
        />
        <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <n-icon size="32" color="white" class="transition-transform group-hover:scale-110">
            <Camera />
          </n-icon>
        </div>
      </div>
      
      <!-- 信息区域 - 样式优化 -->
      <div class="flex-1 min-w-0">
        <n-descriptions 
          label-placement="left" 
          bordered
          class="border-gray-100 rounded-lg"
          label-class="font-medium text-gray-600"
          content-style="min-width: 120px"
        >
          <!-- 可编辑的昵称字段 - 功能增强 -->
          <n-descriptions-item label="昵称" class="py-3">
            <div class="flex items-center">
              <span v-if="!editing" class="text-lg font-semibold truncate">{{ nickname }}</span>
              <n-input 
                v-else
                v-model:value="tempNickname"
                size="medium"
                class="max-w-xs"
                placeholder="请输入昵称"
                autofocus
                @keyup.enter="saveNickname"
              />
              <div class="ml-3 flex space-x-2">
                <n-button
                  v-if="!editing"
                  secondary
                  size="small"
                  class="transition-colors hover:bg-indigo-50"
                  @click="startEditing"
                >
                  <template #icon>
                    <Edit class="text-gray-500" />
                  </template>
                </n-button>
                <template v-else>
                  <n-button
                    secondary
                    size="small"
                    class="transition-colors hover:bg-gray-100"
                    @click="cancelEditing"
                  >
                    取消
                  </n-button>
                  <n-button
                    type="primary"
                    size="small"
                    class="transition-colors"
                    @click="saveNickname"
                    :disabled="!tempNickname.trim()"
                  >
                    保存
                  </n-button>
                </template>
              </div>
            </div>
          </n-descriptions-item>
          
          <n-descriptions-item label="用户ID">U_{{ userId }}</n-descriptions-item>
          <n-descriptions-item label="邮箱">
            <div class="flex items-center">
              {{ email }}
              <n-button text class="ml-2 text-indigo-500" @click="showEditDialog('email')">
                修改
              </n-button>
            </div>
          </n-descriptions-item>
          <n-descriptions-item label="手机号">
            <div class="flex items-center">
              {{ phone }}
              <n-button text class="ml-2 text-indigo-500" @click="showEditDialog('phone')">
                修改
              </n-button>
            </div>
          </n-descriptions-item>
          <n-descriptions-item label="注册时间">{{ joinDate }}</n-descriptions-item>
          <n-descriptions-item label="会员积分">
              {{ score }}
          </n-descriptions-item>
        </n-descriptions>
      </div>
    </div>
    
    <!-- 头像编辑模态框 - 优化后只保留预设头像 -->
    <n-modal 
      v-model:show="showAvatarModal"
      preset="card"
      title="更换头像"
      size="medium"
      :bordered="false"
      class="max-w-2xl"
    >
      <div class="flex flex-col items-center gap-6">
        <!-- 头像预览区域 - 精简样式 -->
        <div class="relative w-40 h-40 flex items-center justify-center rounded-xl overflow-hidden bg-gray-50">
          <img 
            :src="tempAvatarUrl || avatarUrl" 
            class="w-32 h-32 object-cover rounded-full shadow-md border-2 border-white"
          >
          <div 
            v-if="isUpdating"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full"
          >
            <n-spin size="medium" />
          </div>
        </div>
        
        <!-- 预设头像库 - 优化布局 -->
        <div class="w-full">
          <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
            <div 
              v-for="(url, index) in visibleAvatars" 
              :key="index"
              class="cursor-pointer group flex justify-center"
              @click="tempAvatarUrl = url"
            >
              <div 
                class="rounded-lg p-1 transition-all duration-300 ease-in-out group-hover:ring-1 group-hover:ring-indigo-300"
                :class="{
                  'ring-2 ring-indigo-500': tempAvatarUrl === url,
                  'bg-white': tempAvatarUrl !== url
                }"
              >
                <n-avatar
                  round
                  :size="64"
                  :src="url"
                  class="transition-transform group-hover:scale-110"
                  :class="{ 'opacity-80': tempAvatarUrl !== url }"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex gap-4 w-full max-w-md justify-center pt-4">
          <n-button @click="cancelAvatarChange" class="px-6 hover:bg-gray-100">取消</n-button>
          <n-button 
            type="primary" 
            class="px-6 shadow-md"
            @click="saveAvatar"
            :disabled="!tempAvatarUrl || tempAvatarUrl === avatarUrl"
            :loading="isUpdating"
          >
            保存头像
          </n-button>
        </div>
      </div>
    </n-modal>
  </n-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  NCard, 
  NAvatar, 
  NDescriptions, 
  NDescriptionsItem, 
  NButton,
  NModal,
  NInput,
  NSpin,
  useMessage
} from 'naive-ui'
import { Camera, Edit } from '@vicons/fa'

// 响应式数据
const avatarUrl = ref('https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg')
const nickname = ref('蓝色梦想家')
const tempNickname = ref('')
const editing = ref(false)
const showAvatarModal = ref(false)
const tempAvatarUrl = ref('')
const isUpdating = ref(false)
const avatarPage = ref(1)
const message = useMessage()

// 用户信息
const userId = ref('123456789')
const email = ref('user@example.com')
const phone = ref('138****5678')
const joinDate = ref('2023-01-15')
const score = ref(1200)

// 预设头像库 - 优化布局
const allPresetAvatars = [
    '/public/icons/1.svg',
    '/public/icons/2.svg',
    '/public/icons/3.svg',
    '/public/icons/4.svg',
    '/public/icons/5.svg',
    '/public/icons/6.svg',
    '/public/icons/7.svg',
    '/public/icons/8.svg',
    '/public/icons/9.svg',
    '/public/icons/10.svg',
    '/public/icons/11.svg',
    '/public/icons/12.svg',
    '/public/icons/13.svg',
    '/public/icons/14.svg',
    '/public/icons/15.svg',
    '/public/icons/16.svg',
]

const visibleAvatars = computed(() => {
  const start = (avatarPage.value - 1) * 12
  const end = avatarPage.value * 12
  return allPresetAvatars.slice(start, end)
})

// 打开头像编辑器
const openAvatarEditor = () => {
  tempAvatarUrl.value = avatarUrl.value
  showAvatarModal.value = true
}

// 保存头像
const saveAvatar = async () => {
  try {
    isUpdating.value = true
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    avatarUrl.value = tempAvatarUrl.value
    
    message.success('头像更新成功！')
    showAvatarModal.value = false
  } catch (error) {
    message.error('头像更新失败，请重试')
  } finally {
    isUpdating.value = false
  }
}

// 取消头像修改
const cancelAvatarChange = () => {
  showAvatarModal.value = false
}

// 开始编辑昵称
const startEditing = () => {
  tempNickname.value = nickname.value
  editing.value = true
}

// 取消编辑昵称
const cancelEditing = () => {
  editing.value = false
}

// 保存昵称
const saveNickname = () => {
  if (tempNickname.value.trim()) {
    nickname.value = tempNickname.value.trim()
    editing.value = false
    message.success('昵称更新成功！')
  }
}

// 显示编辑对话框
const showEditDialog = (field) => {
  message.info(`将打开${field === 'email' ? '邮箱' : '手机号'}修改对话框`)
}
</script>

<style scoped>
.n-card {
  --n-title-text-color: #4b5563;
  --n-color: white;
}

.n-descriptions-item {
  --n-item-padding: 14px 20px;
}

.rounded-xl {
  border-radius: 14px;
}

.shadow-lg {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
}
</style>