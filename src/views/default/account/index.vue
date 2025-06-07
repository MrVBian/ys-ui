<!-- PersonalCenter.vue 主页面 -->
<template>
  <n-layout has-sider class="min-h-screen">
    <!-- 左侧菜单 -->
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      show-trigger
    >
      <n-menu
        v-model:value="activeKey"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
      />
    </n-layout-sider>
    
    <!-- 右侧内容区域 -->
    <n-layout-content class="p-6">
      <component :is="activeComponent" />
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import { h, ref, computed } from 'vue'
import { NIcon } from 'naive-ui'
import {
  PersonCircleOutline as UserIcon,
  CartOutline as PurchasePackageIcon,
  ReceiptOutline as OrderIcon,
  ImagesOutline as WorksIcon,
  LockClosedOutline as LockIcon
} from '@vicons/ionicons5'

import { UserProfile, Purchase, PurchaseRecords, HistoricalWorks, ChangePassword } from "./components";

const activeKey = ref('profile')

// 菜单配置
const menuOptions = [
  {
    label: '个人信息',
    key: 'profile',
    icon: renderIcon(UserIcon)
  },
  {
    label: '购买套餐',
    key: 'purchase',
    icon: renderIcon(PurchasePackageIcon)
  },
  {
    label: '购买记录',
    key: 'purchaseRecords',
    icon: renderIcon(OrderIcon)
  },
  {
    label: '历史作品',
    key: 'works',
    icon: renderIcon(WorksIcon)
  },
  {
    label: '设置密码',
    key: 'password',
    icon: renderIcon(LockIcon)
  }
]

// 动态组件
const activeComponent = computed(() => {
  switch (activeKey.value) {
    case 'profile': return UserProfile
    case 'purchase': return Purchase
    case 'purchaseRecords': return PurchaseRecords
    case 'works': return HistoricalWorks
    case 'password': return ChangePassword
    default: return UserProfile
  }
})

// 渲染图标方法
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
</script>