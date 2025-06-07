<!-- ChangePassword.vue 修改密码组件 -->
<template>
  <n-card title="设置密码">
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="旧密码" path="oldPassword">
        <n-input
          v-model:value="formData.oldPassword"
          type="password"
          show-password-on="click"
          placeholder="请输入当前使用的密码"
        />
      </n-form-item>
      
      <n-form-item label="新密码" path="newPassword">
        <n-input
          v-model:value="formData.newPassword"
          type="password"
          show-password-on="click"
          placeholder="6-20位字符，包含字母和数字"
        />
      </n-form-item>
      
      <n-form-item label="确认密码" path="confirmPassword">
        <n-input
          v-model:value="formData.confirmPassword"
          type="password"
          show-password-on="click"
          placeholder="请再次输入新密码"
        />
      </n-form-item>
      
      <div class="flex justify-end">
        <n-button 
          type="primary" 
          attr-type="button"
          @click="handleSubmit"
        >
          确认修改
        </n-button>
      </div>
    </n-form>
  </n-card>
</template>

<script setup>
import { NCard, NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui'
import { ref } from 'vue'

const formRef = ref(null)
const message = useMessage()
const formData = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 验证规则
const passwordValidator = (_, value) => {
  if (!value) return new Error('请输入密码')
  if (value.length < 6 || value.length > 20) 
    return new Error('密码长度需在6-20个字符之间')
  if (!/\d/.test(value) || !/[a-zA-Z]/.test(value))
    return new Error('密码需包含字母和数字')
  return true
}

const confirmValidator = (_, value) => {
  if (value !== formData.value.newPassword) 
    return new Error('两次输入的密码不一致')
  return true
}

const rules = {
  oldPassword: [
    { required: true, message: '请输入旧密码' }
  ],
  newPassword: [
    { required: true, validator: passwordValidator, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: confirmValidator, trigger: 'input' }
  ]
}

// 提交处理
function handleSubmit(e) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      message.success('密码修改成功！')
      // 实际项目中这里调用API
      formData.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    } else {
      message.error('请完善表单信息')
    }
  })
}
</script>