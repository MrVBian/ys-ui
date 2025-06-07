<!-- Purchase.vue - 套餐管理组件 -->
<template>
  <n-card title="套餐管理">
    <n-button type="primary" @click="openCreateModal">创建新套餐</n-button>
    
    <!-- 套餐列表 -->
    <n-data-table
      :columns="columns"
      :data="packageList"
    />
    
    <!-- 套餐编辑模态框 -->
    <package-edit-modal
      v-model:show="showEditModal"
      :package-data="currentPackage"
      @submit="handlePackageSubmit"
    />
  </n-card>
</template>

<script setup>
import { ref } from 'vue'

const packageList = ref([]) // 套餐列表
const showEditModal = ref(false)
const currentPackage = ref(null)

const columns = [
  { title: '套餐名称', key: 'name' },
  { title: '原价', key: 'originalPrice' },
  { title: '活动价', key: 'discountPrice' },
  { title: '积分', key: 'points' },
  { title: '状态', key: 'status' },
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
        {
          size: 'small',
          type: row.status === 'active' ? 'warning' : 'success',
          onClick: () => toggleStatus(row)
        },
        { default: () => row.status === 'active' ? '下架' : '上架' }
      )
    ]
  }
]

function openCreateModal() {
  currentPackage.value = null
  showEditModal.value = true
}

function openEditModal(pkg) {
  currentPackage.value = { ...pkg }
  showEditModal.value = true
}

function toggleStatus(pkg) {
  // 调用API更新状态
}

function handlePackageSubmit(newPackage) {
  if (newPackage.id) {
    // 更新现有套餐
    const index = packageList.value.findIndex(p => p.id === newPackage.id)
    packageList.value[index] = { ...newPackage }
  } else {
    // 添加新套餐
    packageList.value.push({ ...newPackage, id: Date.now() })
  }
}
</script>