<template>
  <div class="purchase-container">
    <n-h1 class="title">选择套餐</n-h1>
    <div class="card-container">
      <n-card
        v-for="plan in plans"
        :key="plan.id"
        class="plan-card"
        :title="plan.name"
        header-style="font-size: 18px; font-weight: bold;"
      >
        <template #header-extra>
          <n-tag v-if="plan.recommended" type="success" round>推荐</n-tag>
        </template>
        
        <n-space vertical>
          <n-text class="price">
            <span class="original-price" v-if="plan.originalPrice">¥{{ plan.originalPrice }}</span>
            <span class="current-price">¥{{ plan.price }}</span>
          </n-text>
          
          <!-- 新增积分显示区域 -->
          <div class="points-container">
            <n-text class="points-text" strong>赠送积分: </n-text>
            <n-tag :bordered="false" type="info" class="points-tag">
              {{ plan.points }} 积分
            </n-tag>
          </div>
          
          <n-text depth="3" class="description">{{ plan.description }}</n-text>
          
          <n-divider />
          
          <n-text strong class="payment-amount">支付金额: ¥{{ plan.price }}</n-text>
          
          <div class="qrcode-container">
            <div class="qrcode-wrapper">
              <img :src="plan.qrCode" alt="支付二维码" class="qrcode-image" />
            </div>
            <n-text class="qrcode-hint">扫码支付</n-text>
          </div>
        </n-space>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  NCard, 
  NText, 
  NSpace, 
  NDivider, 
  NTag,
  NH1 
} from 'naive-ui';

// 套餐数据
const plans = ref([
  {
    id: 1,
    name: '基础套餐',
    originalPrice: 99,
    price: 68,
    points: 500, // 新增积分字段
    description: '适合个人用户的基础功能套餐，包含核心服务',
    qrCode: 'https://dummyimage.com/150x150/4a86cf/ffffff&text=Basic',
    recommended: false
  },
  {
    id: 2,
    name: '专业套餐',
    originalPrice: 199,
    price: 158,
    points: 1500, // 新增积分字段
    description: '面向专业人士的增强套餐，包含高级功能和技术支持',
    qrCode: 'https://dummyimage.com/150x150/674ea7/ffffff&text=Pro',
    recommended: true
  },
  {
    id: 3,
    name: '企业套餐',
    originalPrice: 499,
    price: 399,
    points: 5000, // 新增积分字段
    description: '为企业用户定制的全方位解决方案，包含所有功能和服务',
    qrCode: 'https://dummyimage.com/150x150/ff9900/ffffff&text=Enterprise',
    recommended: false
  },
  
]);
</script>

<style scoped>
/* 原有样式保持不变 */
.purchase-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.plan-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 12px;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.price {
  margin: 12px 0;
  display: block;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  margin-right: 8px;
  font-size: 0.9em;
}

.current-price {
  font-size: 1.4em;
  font-weight: bold;
  color: #f0ad4e;
}

.description {
  min-height: 40px;
  display: block;
}

.payment-amount {
  font-size: 1.2em;
  color: #e74c3c;
  display: block;
  margin: 16px 0;
  text-align: center;
}

.qrcode-container {
  margin-top: 15px;
  text-align: center;
}

.qrcode-wrapper {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  display: inline-block;
  background-color: #f9f9f9;
}

.qrcode-image {
  width: 150px;
  height: 150px;
  display: block;
}

.qrcode-hint {
  display: block;
  margin-top: 10px;
  color: #888;
  font-size: 0.9em;
}

/* 新增积分样式 */
.points-container {
  display: flex;
  align-items: center;
  margin: 8px 0;
  gap: 8px;
}

.points-text {
  font-size: 0.95em;
  color: #666;
}

.points-tag {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #096dd9;
  font-weight: bold;
  border-radius: 4px;
  padding: 2px 8px;
}
</style>