<!-- PurchaseRecords.vue 购买记录组件 -->
<template>
  <n-card title="购买记录">
    <n-data-table
      :columns="columns"
      :data="orderData"
      :pagination="pagination"
      striped
    />
  </n-card>
</template>

<script setup>
import { NCard, NDataTable } from 'naive-ui'
import { h } from 'vue'

// 表格列配置
const columns = [
  {
    title: '订单号',
    key: 'orderId',
    sorter: true
  },
  {
    title: '产品名称',
    key: 'product'
  },
  {
    title: '金额',
    key: 'amount',
    render: row => h('span', { class: 'text-red-500 font-medium' }, `¥${row.amount}`)
  },
  {
    title: '支付时间',
    key: 'time',
    sorter: (a, b) => new Date(a.time) - new Date(b.time)
  },
  {
    title: '状态',
    key: 'status',
    render: row => h('n-tag', {
      type: row.status === '已完成' ? 'success' : 'warning'
    }, row.status)
  }
]

// 订单数据
const orderData = [
  { orderId: 'DD20230520001', product: '高级会员套餐', amount: 299, time: '2023-05-20 14:23:10', status: '已完成' },
  { orderId: 'DD20230518003', product: '设计素材包', amount: 89, time: '2023-05-18 09:12:45', status: '已完成' },
  { orderId: 'DD20230515007', product: 'AI生成额度', amount: 49, time: '2023-05-15 19:34:22', status: '待付款' },
  { orderId: 'DD20230510002', product: 'VIP升级包', amount: 159, time: '2023-05-10 11:45:33', status: '已完成' }
]

// 分页配置
const pagination = { pageSize: 5 }
</script>