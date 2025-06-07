<template>
  <n-dropdown
    trigger="click"
    placement="bottom-end"
    :options="menuOptions"
    @select="handleSelect"
  >
    <n-avatar
      round
      size="medium"
      :src="userAvatar"
      class="cursor-pointer hover:opacity-80 transition-opacity"
    />
  </n-dropdown>

  <!-- 找回密码模态框 -->
  <n-modal v-model:show="showPasswordModal">
    <n-card
      style="width: 500px; max-width: 90vw"
      title="找回密码"
      bordered
      size="small"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button quaternary circle @click="showPasswordModal = false">
          <template #icon>
            <n-icon><CloseOutline /></n-icon>
          </template>
        </n-button>
      </template>

      <n-form ref="passwordFormRef" :model="passwordForm">
        <n-form-item label="注册邮箱" path="email">
          <n-input v-model:value="passwordForm.email" placeholder="请输入注册邮箱" />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showPasswordModal = false">取消</n-button>
          <n-button type="primary" @click="handlePasswordRecovery">发送重置邮件</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>

  <!-- 联系客服模态框 -->
  <n-modal v-model:show="showContactModal">
    <n-card
      style="width: 600px; max-width: 90vw"
      title="联系客服"
      bordered
      size="small"
      role="dialog"
      aria-modal="true"
    >
      <div class="contact-content">
        <n-space vertical>
          <div class="contact-method">
            <n-icon size="20" color="#2d8cf0"><CallOutline /></n-icon>
            <span>客服电话：400-123-4567</span>
          </div>
          <div class="contact-method">
            <n-icon size="20" color="#19be6b"><MailOutline /></n-icon>
            <span>邮箱：support@example.com</span>
          </div>
          <div class="contact-method">
            <n-icon size="20" color="#ed4014"><ChatboxEllipsesOutline /></n-icon>
            <span>在线客服：工作日 9:00-18:00</span>
          </div>
          <div class="contact-method">
            <n-icon size="20" color="#19be6b"><LogoWechat /></n-icon>
            <span>微信二维码：</span>
          </div>
        </n-space>
        <n-image
          width="200"
          src="/public/example/QRCode.png"
        />

        <!--
        <n-divider />
        <n-form :model="contactForm" label-placement="top">
          <n-form-item label="问题描述">
            <n-input
              v-model:value="contactForm.message"
              type="textarea"
              :autosize="{ minRows: 3 }"
              placeholder="请详细描述您的问题"
            />
          </n-form-item>
        </n-form>
         -->
      </div>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showContactModal = false">关闭</n-button>
          <!-- <n-button type="primary" @click="submitContactForm">提交</n-button>  -->
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  NDropdown,
  NAvatar,
  NModal,
  NCard,
  NButton,
  NIcon,
  NSpace,
  NForm,
  NFormItem,
  NInput,
  NDivider,
  useMessage
} from 'naive-ui';
import {
  CloseOutline,
  CallOutline,
  MailOutline,
  ChatboxEllipsesOutline,
  LogoWechat
} from '@vicons/ionicons5';
import { useRouter } from 'vue-router';


// 用户信息模拟数据
const userAvatar = ref('https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg');
const userName = ref('用户名');

// 模态框控制
const showPasswordModal = ref(false);
const showContactModal = ref(false);

// 表单数据
const passwordForm = ref({
  email: ''
});
const contactForm = ref({
  message: ''
});

const message = useMessage();

// 菜单配置
const menuOptions = ref([
  {
    label: '个人中心',
    key: 'account',
  },
  {
    label: '后台管理',
    key: 'dashboard',
  },
  {
    type: 'divider',
    key: 'divider-1'
  },
  {
    label: '找回密码',
    key: 'password',
  },
  {
    label: '联系客服',
    key: 'support',
  },
  {
    type: 'divider',
    key: 'divider-2'
  },
  {
    label: '退出登录',
    key: 'logout',
    props: {
      style: { color: '#d03050' }
    }
  }
]);

// 菜单选择处理
const handleSelect = (key: string) => {
  switch (key) {
    case 'account':
      navigateToAccount();
      break;
    case 'dashboard':
      navigateToDashboard();
      break;
    case 'password':
      showPasswordModal.value = true;
      break;
    case 'support':
      showContactModal.value = true;
      break;
    case 'logout':
      handleLogout();
      break;
  }
};

const router = useRouter();
// 页面导航功能
const navigateToAccount = () => {
  message.info('跳转到个人中心页面');
  router.push('/account');
  // 实际项目中使用 router.push('/account')
};

const navigateToDashboard = () => {
  message.info('跳转到后台管理页面');
  router.push('/dashboard');
  // router.push('/report')
};

// 找回密码功能
const handlePasswordRecovery = () => {
  if (!passwordForm.value.email) {
    message.error('请输入邮箱地址');
    return;
  }
  
  // 模拟API请求
  setTimeout(() => {
    message.success(`密码重置邮件已发送至：${passwordForm.value.email}`);
    showPasswordModal.value = false;
    passwordForm.value.email = '';
  }, 1000);
};

// 提交客服表单
const submitContactForm = () => {
  if (!contactForm.value.message) {
    message.error('请输入问题描述');
    return;
  }
  
  // 模拟API请求
  setTimeout(() => {
    message.success('客服请求已提交，我们将尽快回复您');
    contactForm.value.message = '';
    showContactModal.value = false;
  }, 1000);
};

// 退出登录功能
const handleLogout = () => {
  // 实际项目中：
  // 1. 清除用户凭证 (token)
  // 2. 重置用户状态 (Vuex/Pinia)
  // 3. 重定向到登录页
  
  message.success('退出登录成功');
  // router.push('/login');
};
</script>

<style scoped>
.contact-content {
  padding: 10px 5px;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
</style>