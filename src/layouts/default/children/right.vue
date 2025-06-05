<script setup lang="ts">
import { watch, ref, computed } from "vue";
import { Person24Regular, Password24Regular } from "@vicons/fluent";
import {
  userInfo,
  useSharedAuthModal,
  userLogin,
  userLogout,
  hasPermissionPrefix,
  type LoginData,
} from "@/composables/auth";

const options = computed(() => [
  {
    label: "个人中心",
    key: "profile",
  },
  {
    label: "我的提交",
    key: "submission",
  },
  {
    label: "我的设置",
    key: "setting",
  },
  {
    label: "后台管理",
    key: "admin",
    show: hasPermissionPrefix("admin:"),
  },
  {
    key: "header-divider",
    type: "divider",
  },
  {
    label: "退出登录",
    key: "logout",
  },
]);

const { navModalMode } = useSharedAuthModal();

const loginData = ref<LoginData>({
  username: "",
  password: "",
});
const registerData = ref({
  username: "",
  password: "",
  confirm_password: "",
});

function openLoginModal() {
  loginData.value = {
    username: "",
    password: "",
  };
  navModalMode.value = 1;
}

function openRegisterModal() {
  registerData.value = {
    username: "",
    password: "",
    confirm_password: "",
  };
  navModalMode.value = 2;
}

const showModal = ref(false);
const modalTitle = ref("");
watch(
  navModalMode,
  () => {
    if (navModalMode.value === 1) {
      modalTitle.value = "登录";
      showModal.value = true;
    } else if (navModalMode.value === 2) {
      modalTitle.value = "注册";
      showModal.value = true;
    } else {
      showModal.value = false;
    }
  },
  {
    immediate: true,
  },
);
const btnLoading = ref(false);

function handleLogin() {
  btnLoading.value = true;
  userLogin(loginData.value)
    .then(() => {
      navModalMode.value = 0;
    })
    .catch(() => {})
    .finally(() => {
      btnLoading.value = false;
    });
}

function handleSelect(key: string) {
  switch (key) {
    case "profile":
      break;
    case "submission":
      break;
    case "setting":
      break;
    case "admin":
      break;
    case "logout":
      userLogout();
      break;
  }
}
</script>

<template>
  <n-dropdown
    v-if="userInfo"
    @select="handleSelect"
    trigger="hover"
    :options="options"
    show-arrow
  >
    <div flex="~ items-center" gap8px whitespace-nowrap>
      <n-avatar
        v-if="userInfo.avatar"
        round
        size="small"
        :src="userInfo.avatar"
      />
      <n-avatar v-else round size="small">
        {{ userInfo.username[0].toUpperCase() }}
      </n-avatar>
      <div>{{ userInfo.username }}</div>
    </div>
  </n-dropdown>
  <div v-else flex gap8px>
    <n-button type="primary" @click="openLoginModal">登录</n-button>
    <n-button @click="openRegisterModal">注册</n-button>
    <n-modal
      preset="card"
      class="w-350px fixed top-150px left-[calc(50%-175px)]"
      :title="modalTitle"
      v-model:show="showModal"
      @update:show="navModalMode = 0"
    >
      <!-- 登录表单 -->
      <template v-if="navModalMode === 1">
        <n-form-item :show-label="false">
          <n-input
            v-model:value="loginData.username"
            placeholder="请输入用户名"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <n-icon>
                <Person24Regular />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item :show-label="false">
          <n-input
            v-model:value="loginData.password"
            type="password"
            show-password-on="click"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <n-icon>
                <Password24Regular />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-button
          :loading="btnLoading"
          @click="handleLogin"
          type="primary"
          class="w-full"
        >
          登录
        </n-button>
      </template>
      <!-- 注册表单 -->
      <template v-else-if="navModalMode === 2"> </template>
    </n-modal>
  </div>
</template>
