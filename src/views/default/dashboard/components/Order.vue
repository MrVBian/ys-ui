<!-- Order.vue - 订单管理组件 -->
<template>
  <n-card title="订单管理">
    <!-- 时间筛选 -->
    <n-space vertical>
      <n-date-picker
        v-model:value="timeRange"
        type="datetimerange"
        clearable
        style="width: 400px"
      />
      
      <!-- 订单表格 -->
      <n-data-table
        :columns="columns"
        :data="orderList"
        :pagination="pagination"
      />
    </n-space>
  </n-card>
</template>

<script setup>
import { ref, watch } from 'vue'

const timeRange = ref([Date.now(), Date.now()])
const orderList = ref([]) // 订单数据
const pagination = { pageSize: 10 }

watch(timeRange, (range) => {
  if (range && range.length === 2) {
    fetchOrders(range[0], range[1])
  }
})

const columns = [
  { title: '订单号', key: 'orderId' },
  { title: '用户', key: 'userName' },
  { title: '套餐名称', key: 'packageName' },
  { title: '实付金额', key: 'amount' },
  { title: '支付渠道', key: 'paymentMethod' },
  { title: '创建时间', key: 'createdAt' },
  { title: '支付时间', key: 'paidAt' },
  { 
    title: '状态', 
    key: 'status',
    render: (row) => {
      const statusMap = {
        pending: { type: 'warning', text: '待支付' },
        completed: { type: 'success', text: '已完成' },
        failed: { type: 'error', text: '未完成' }
      }
      const status = statusMap[row.status]
      return h(
        NTag,
        { type: status.type },
        { default: () => status.text }
      )
    }
  }
]

function fetchOrders(startTime, endTime) {
  // 调用API获取订单数据
  // orderList.value = await fetchOrders(startTime, endTime)
}
</script>