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
  PeopleCircleOutline as UserManagerIcon,
  BagHandleOutline as PackageManagerIcon,
  DocumentTextOutline as OrderManagerIcon,
  SettingsOutline as SystemSettingsIcon
} from '@vicons/ionicons5';

import { UserMgmt, Purchase, Order, System } from "./components";

const activeKey = ref('profile')

// 菜单配置
const menuOptions = [
  {
    label: '用户管理',
    key: 'userMgmt',
    icon: renderIcon(UserManagerIcon)
  },
  {
    label: '套餐管理',
    key: 'purchase',
    icon: renderIcon(PackageManagerIcon)
  },
  {
    label: '订单管理',
    key: 'order',
    icon: renderIcon(OrderManagerIcon)
  },
  {
    label: '系统设置',
    key: 'system',
    icon: renderIcon(SystemSettingsIcon)
  }
]

// 动态组件
const activeComponent = computed(() => {
  switch (activeKey.value) {
    case 'userMgmt': return UserMgmt
    case 'purchase': return Purchase
    case 'order': return Order
    case 'system': return System
    default: return UserMgmt
  }
})

// 渲染图标方法
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
</script>