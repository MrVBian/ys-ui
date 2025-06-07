<!-- UserMgmt.vue - 用户管理组件 -->
<template>
  <n-card title="用户管理">
    <!-- 搜索区域 -->
    <n-space vertical>
      <n-input-group>
        <n-input placeholder="邮箱搜索" v-model:value="emailSearch" />
        <n-input placeholder="手机号搜索" v-model:value="phoneSearch" />
        <n-button type="primary" @click="searchUsers">搜索</n-button>
      </n-input-group>

      <!-- 用户列表 -->
      <n-data-table
        :columns="columns"
        :data="userList"
        :pagination="pagination"
        :loading="loading"
      />
    </n-space>
    
    <!-- 编辑用户模态框 -->
    <user-edit-modal
      v-model:show="showEditModal"
      :user="selectedUser"
      @update="handleUserUpdate"
    />
  </n-card>
</template>

<script setup>
import { ref } from 'vue'
import { NH2, NButton, NCard, NDataTable, NInput, NInputGroup, NSpace } from 'naive-ui'
import { userInfo } from '@/data/dashboard'

// 用户列表列配置
const columns = [
  { title: 'ID', key: 'id' },
  { title: '昵称', key: 'username' },
  { title: '邮箱', key: 'email' },
  { title: '手机号', key: 'phone' },
  { title: '注册时间', key: 'createdAt' },
  { title: '积分', key: 'points' },
  {
    title: '操作',
    key: 'actions',
    render: (row) => [
      h(
        NButton,
        { size: 'small', onClick: () => openEditModal(row) },
        { default: () => '编辑' }
      ),
      h(
        NButton,
        { size: 'small', type: 'warning', onClick: () => resetPassword(row.id) },
        { default: () => '重置密码' }
      )
    ]
  }
]

const userList = ref([]) // 用户列表数据
const loading = ref(false)
const emailSearch = ref('')
const phoneSearch = ref('')
const showEditModal = ref(false)
const selectedUser = ref(null)

async function searchUsers() {
  loading.value = true
  // 调用API获取用户列表
  // const response = await fetchUsers({ email: emailSearch.value, phone: phoneSearch.value })
  // userList.value = response.data
  loading.value = false
}

function openEditModal(user) {
  selectedUser.value = { ...user }
  showEditModal.value = true
}

function resetPassword(userId) {
  // 调用重置密码API
}

function handleUserUpdate(updatedUser) {
  const index = userList.value.findIndex(u => u.id === updatedUser.id)
  if (index !== -1) {
    userList.value[index] = { ...updatedUser }
  }
}
</script>