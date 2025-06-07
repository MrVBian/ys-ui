<template>
  <n-card title="系统设置">
    <n-tabs type="line">
      <n-tab-pane name="smtp" tab="SMTP配置">
        <n-form>
          <n-form-item label="SMTP服务器">
            <n-input v-model:value="smtpConfig.host" />
          </n-form-item>
          <n-form-item label="端口">
            <n-input-number v-model:value="smtpConfig.port" />
          </n-form-item>
          <n-form-item label="安全协议">
            <n-select v-model:value="smtpConfig.secure" :options="secureOptions" />
          </n-form-item>
          <n-form-item label="用户名">
            <n-input v-model:value="smtpConfig.user" />
          </n-form-item>
          <n-form-item label="密码">
            <n-input v-model:value="smtpConfig.pass" type="password" show-password-on="click" />
          </n-form-item>
          <n-form-item label="发件邮箱">
            <n-input v-model:value="smtpConfig.from" />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="testSMTP">测试配置</n-button>
            <n-button type="primary" @click="saveSMTPConfig" style="margin-left: 10px">保存</n-button>
          </n-form-item>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import { ref } from 'vue'

const smtpConfig = ref({
  host: 'smtp.example.com',
  port: 465,
  secure: 'ssl',
  user: 'admin@example.com',
  pass: 'password',
  from: 'noreply@example.com'
})

const secureOptions = [
  { label: 'SSL/TLS', value: 'ssl' },
  { label: 'STARTTLS', value: 'tls' },
  { label: '无', value: 'none' }
]

function testSMTP() {
  // 测试SMTP配置逻辑
  console.log('Testing SMTP configuration')
}

function saveSMTPConfig() {
  // 保存SMTP配置逻辑
  console.log('Saving SMTP config:', smtpConfig.value)
}
</script>