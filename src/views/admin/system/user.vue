<template>
  <n-flex vertical>
    <n-card>
      <n-form
        label-placement="left"
        :show-feedback="false"
        @keydown.shift.enter.exact="fetchData(1)"
      >
        <n-grid
          :cols="12"
          :x-gap="24"
          :y-gap="24"
          :collapsed="searchFormCollapsed"
          item-responsive
        >
          <n-form-item-gi label="用户名称:" span="6 800:4 1000:3">
            <n-input
              v-model:value="whereParams.usernameContainsFold"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="账号状态:" span="6 800:4 1000:3">
            <BoolSelect
              v-model:value="whereParams.isBanned"
              true-label="封禁"
              false-label="正常"
              :true-color="themeVars.errorColor"
              :false-color="themeVars.primaryColor"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="验证状态:" span="6 800:4 1000:3">
            <BoolSelect
              v-model:value="whereParams.isVerified"
              true-label="已验证"
              false-label="未验证"
              :true-color="themeVars.primaryColor"
              :false-color="themeVars.warningColor"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="邮箱地址:" span="6 800:4 1000:3">
            <n-input v-model:value="whereParams.emailContainsFold" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="用户昵称:" span="6 800:4 1000:3">
            <n-input
              v-model:value="whereParams.nicknameContainsFold"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="真实姓名:" span="6 800:4 1000:3">
            <n-input
              v-model:value="whereParams.realNameContainsFold"
              clearable
            />
          </n-form-item-gi>
          <n-gi suffix span="6 800:4 1000:3" #="{ overflow }">
            <n-flex justify="end">
              <n-button @click="resetSearchForm()">重置</n-button>
              <n-button
                type="primary"
                :loading="loading.table"
                @click="fetchData(1)"
              >
                查询
              </n-button>
              <n-button
                v-if="overflow || !searchFormCollapsed"
                text
                type="primary"
                @click="searchFormCollapsed = !searchFormCollapsed"
              >
                {{ searchFormCollapsed ? "展开" : "收起" }}
                <n-icon
                  :size="17"
                  :style="{ rotate: searchFormCollapsed ? '0deg' : '180deg' }"
                >
                  <ChevronDown16Filled />
                </n-icon>
              </n-button>
            </n-flex>
          </n-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-flex>
      <n-button
        type="primary"
        :render-icon="renderIcon(Add24Regular)"
        @click="openAddOrEditModal(0)"
      >
        添加用户
      </n-button>
    </n-flex>
    <n-data-table
      remote
      :loading="loading.table"
      :data="users"
      :columns="columns"
      :pagination="pagination"
      :paginate-single-page="false"
      :scroll-x="1200"
    >
      <template #empty>
        <n-empty description="暂无用户~" />
      </template>
    </n-data-table>
    <n-modal
      preset="card"
      class="w-400px fixed top-180px left-[calc(50%-200px)]"
      :title="userModel.id > 0 ? '编辑用户' : '创建用户'"
      v-model:show="showAddOrEditModal"
    >
      <n-form
        ref="userFormRef"
        :model="userModel"
        :rules="{
          username: [
            {
              required: true,
              message: '用户名称不能为空',
              trigger: ['input', 'blur'],
            },
          ],
          email: [
            {
              required: true,
              message: '邮箱地址不能为空',
              trigger: ['input', 'blur'],
            },
            {
              type: 'email',
              message: '邮箱地址格式不正确',
              trigger: ['input', 'blur'],
            },
          ],
          password: [
            {
              required: true,
              message: '密码不能为空',
              trigger: ['input', 'blur'],
            },
          ],
        }"
      >
        <n-form-item label="用户名称" required path="username">
          <CounterInput v-model:value="userModel.username" :maxlength="60" />
        </n-form-item>
        <n-form-item label="邮箱地址" required path="email">
          <CounterInput v-model:value="userModel.email" :maxlength="240" />
        </n-form-item>
        <n-form-item
          v-if="userModel.id === 0"
          label="密码"
          required
          path="password"
        >
          <CounterInput v-model:value="userModel.password" :maxlength="60" />
        </n-form-item>
        <n-form-item label="用户昵称">
          <CounterInput v-model:value="userModel.nickname" :maxlength="60" />
        </n-form-item>
        <n-form-item label="真实姓名">
          <CounterInput v-model:value="userModel.real_name" :maxlength="60" />
        </n-form-item>
        <n-form-item label="是否封禁">
          <n-switch v-model:value="userModel.is_banned" />
        </n-form-item>
        <n-form-item :show-label="false" :show-feedback="false">
          <n-flex>
            <n-button
              :loading="loading.saveUserBtn"
              type="primary"
              @click="handleSaveUser"
            >
              保存
            </n-button>
            <n-button @click="() => (showAddOrEditModal = false)">
              取消
            </n-button>
          </n-flex>
        </n-form-item>
      </n-form>
    </n-modal>
    <n-modal
      preset="card"
      class="w-400px fixed top-180px left-[calc(50%-200px)]"
      :title="`${currentUsername} - 重置密码`"
      v-model:show="showResetPasswordModal"
    >
      <n-form
        ref="resetPasswordFormRef"
        :model="resetPasswordModel"
        :rules="{
          password: [
            {
              required: true,
              message: '密码不能为空',
              trigger: ['input', 'blur'],
            },
          ],
          confirmPassword: [
            {
              required: true,
              message: '确认密码不能为空',
              trigger: ['input', 'blur'],
            },
            {
              validator: (_, value: string) => {
                if (value !== resetPasswordModel.password) {
                  return new Error('两次密码不一致');
                }
                return true;
              },
              trigger: ['input', 'blur'],
            },
          ],
        }"
      >
        <n-form-item label="新的密码" required path="password">
          <CounterInput
            type="password"
            v-model:value="resetPasswordModel.password"
            :maxlength="60"
          />
        </n-form-item>
        <n-form-item label="确认密码" required path="confirmPassword">
          <CounterInput
            type="password"
            v-model:value="resetPasswordModel.confirmPassword"
            :maxlength="60"
          />
        </n-form-item>
        <n-form-item :show-label="false" :show-feedback="false">
          <n-flex>
            <n-button
              :loading="loading.resetPasswordBtn"
              type="primary"
              @click="handleResetPassword"
            >
              保存
            </n-button>
            <n-button @click="() => (showResetPasswordModal = false)">
              取消
            </n-button>
          </n-flex>
        </n-form-item>
      </n-form>
    </n-modal>
  </n-flex>
</template>

<script setup lang="ts">
import { h, ref, reactive } from "vue";
import request, { type Page } from "@/utils/request";
import { renderIcon } from "@/utils/render";
import {
  type FormInst,
  type DataTableColumn,
  NButton,
  NAvatar,
  NFlex,
  NTag,
  NPopconfirm,
  useThemeVars,
} from "naive-ui";
import RelativeTime from "@/components/RelativeTime.vue";
import { Add24Regular, ChevronDown16Filled } from "@vicons/fluent";

const themeVars = useThemeVars();

const loading = ref({
  editBtn: false,
  saveUserBtn: false,
  table: false,
  resetPasswordBtn: false,
});

const columns: DataTableColumn[] = [
  {
    title: "ID",
    key: "id",
    align: "center",
    width: 80,
  },
  {
    title: "用户名称",
    key: "username",
    align: "center",
    width: 150,
    ellipsis: {
      tooltip: true,
    },
    render({ username, avatar }) {
      return h(
        NFlex,
        { align: "center", justify: "center", size: "small", wrap: false },
        {
          default: () => [
            avatar
              ? h(NAvatar, {
                  size: 22,
                  src: avatar as string,
                  round: true,
                })
              : h(
                  NAvatar,
                  {
                    size: 22,
                    round: true,
                  },
                  {
                    default: () =>
                      (username as string).slice(0, 1).toUpperCase(),
                  },
                ),
            username,
          ],
        },
      );
    },
  },
  {
    title: "邮箱",
    key: "email",
    align: "center",
    width: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "昵称",
    key: "nickname",
    align: "center",
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "真实姓名",
    key: "real_name",
    align: "center",
    width: 80,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "AC币",
    key: "coins",
    align: "center",
    width: 100,
  },
  {
    title: "用户状态",
    key: "is_banned",
    align: "center",
    width: 100,
    render({ is_banned }) {
      return h(
        NFlex,
        {
          align: "center",
          justify: "center",
          size: "small",
          wrap: false,
        },
        {
          default: () => [
            h(
              NTag,
              { type: is_banned ? "error" : "success" },
              {
                default: () => (is_banned ? "封禁" : "正常"),
              },
            ),
          ],
        },
      );
    },
  },
  {
    title: "验证状态",
    key: "is_verified",
    align: "center",
    width: 100,
    render({ is_verified }) {
      return h(
        NFlex,
        {
          align: "center",
          justify: "center",
          size: "small",
          wrap: false,
        },
        {
          default: () => [
            h(
              NTag,
              { type: is_verified ? "success" : "warning" },
              {
                default: () => (is_verified ? "已验证" : "未验证"),
              },
            ),
          ],
        },
      );
    },
  },
  {
    title: "最后在线时间",
    key: "last_online_at",
    align: "center",
    width: 120,
    render({ last_online_at }) {
      return (last_online_at as string).startsWith("0001-01-01")
        ? "从未登录"
        : h(RelativeTime, { time: last_online_at as string });
    },
  },
  {
    title: "创建时间",
    key: "create_time",
    align: "center",
    width: 100,
    render({ create_time }) {
      return h(RelativeTime, { time: create_time as string });
    },
  },
  {
    title: "更新时间",
    key: "update_time",
    align: "center",
    width: 100,
    render({ update_time }) {
      return h(RelativeTime, { time: update_time as string });
    },
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    width: 240,
    fixed: "right",
    render({ id, username }) {
      return h(
        NFlex,
        {
          justify: "center",
          align: "center",
          gap: 12,
        },
        {
          default: () => [
            h(
              NButton,
              {
                size: "small",
                secondary: true,
                type: "info",
                loading: loading.value.editBtn && currentUserId.value === id,
                disabled: loading.value.editBtn && currentUserId.value !== id,
                onClick: () => openAddOrEditModal(id as number),
              },
              { default: () => "编辑" },
            ),
            h(
              NButton,
              {
                size: "small",
                secondary: true,
                loading:
                  loading.value.resetPasswordBtn && currentUserId.value === id,
                disabled:
                  loading.value.resetPasswordBtn && currentUserId.value !== id,
                onClick: () =>
                  openResetPasswordModal(id as number, username as string),
              },
              { default: () => "重置密码" },
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeleteUser(id as number),
              },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: "small",
                      secondary: true,
                      type: "error",
                    },
                    { default: () => "删除" },
                  ),
                default: () => "确认删除该权限吗？",
              },
            ),
          ],
        },
      );
    },
  },
];

const searchFormCollapsed = ref(true);
const whereParams = ref({
  usernameContainsFold: "",
  emailContainsFold: "",
  nicknameContainsFold: "",
  realNameContainsFold: "",
  isBanned: null as boolean | null,
  isVerified: null as boolean | null,
});

const users = ref([]);
const pagination = reactive({
  page: 1,
  pageSize: 15,
  itemCount: 0,
  pageSizes: [10, 15, 30, 50],
  showSizePicker: true,
  prefix({ itemCount }) {
    return `共 ${itemCount} 人`;
  },
  onUpdatePage(page: number) {
    fetchData(page);
  },
  onUpdatePageSize(pageSize: number) {
    fetchData(1, pageSize);
  },
});

function resetSearchForm() {
  whereParams.value = {
    usernameContainsFold: "",
    emailContainsFold: "",
    nicknameContainsFold: "",
    realNameContainsFold: "",
    isBanned: null as boolean | null,
    isVerified: null as boolean | null,
  };
  fetchData(1);
}

const userFormRef = ref<FormInst | null>(null);
const currentUserId = ref(0);
const showAddOrEditModal = ref(false);
const userModel = ref({
  id: 0,
  username: "",
  email: "",
  password: "",
  nickname: "",
  real_name: "",
  is_banned: false,
});
async function openAddOrEditModal(id: number = 0) {
  try {
    if (id > 0) {
      currentUserId.value = id;
      loading.value.editBtn = true;
      userModel.value = await request.get(`/admin/users/${id}`);
    } else {
      userModel.value = {
        id: 0,
        username: "",
        email: "",
        password: "",
        nickname: "",
        real_name: "",
        is_banned: false,
      };
    }
    showAddOrEditModal.value = true;
  } catch {
    // pass
  } finally {
    loading.value.editBtn = false;
  }
}
function handleSaveUser() {
  userFormRef.value
    ?.validate(
      () => {},
      (rule) => {
        if (userModel.value.id === 0) {
          return true;
        }
        return rule.key !== "password";
      },
    )
    .then(async (valid) => {
      if (!valid) {
        return;
      }
      loading.value.saveUserBtn = true;
      try {
        if (userModel.value.id > 0) {
          await request.put<void>(
            `/admin/users/${userModel.value.id}`,
            userModel.value,
          );
        } else {
          await request.post<void>("/admin/users", userModel.value);
        }
        currentUserId.value = 0;
        fetchData(-1); // 保持当前页码
        showAddOrEditModal.value = false;
      } catch {
        // pass
      } finally {
        loading.value.saveUserBtn = false;
      }
    });
}
function handleDeleteUser(id: number) {
  request.delete<void>(`/admin/users/${id}`).then(() => {
    fetchData(-1); // 保持当前页码
  });
}

const resetPasswordModel = ref({
  password: "",
  confirmPassword: "",
});
const currentUsername = ref("");
const showResetPasswordModal = ref(false);
const resetPasswordFormRef = ref<FormInst | null>(null);
async function openResetPasswordModal(id: number, username: string) {
  try {
    currentUserId.value = id;
    currentUsername.value = username;
    loading.value.resetPasswordBtn = true;
    resetPasswordModel.value = {
      password: "",
      confirmPassword: "",
    };
    showResetPasswordModal.value = true;
  } catch {
    // pass
  } finally {
    loading.value.resetPasswordBtn = false;
  }
}
function handleResetPassword() {
  resetPasswordFormRef.value?.validate().then(async (valid) => {
    if (!valid) {
      return;
    }
    loading.value.resetPasswordBtn = true;
    try {
      await request.put<void>(`/admin/users/${currentUserId.value}/password`, {
        password: resetPasswordModel.value.password,
      });
      currentUserId.value = 0;
      currentUsername.value = "";
      fetchData(-1); // 保持当前页码
      showResetPasswordModal.value = false;
    } catch {
      // pass
    } finally {
      loading.value.resetPasswordBtn = false;
    }
  });
}

function fetchData(page = 0, pageSize = 0) {
  if (page > 0) {
    pagination.page = page;
  }
  if (pageSize > 0) {
    pagination.pageSize = pageSize;
  }
  loading.value.table = true;
  request
    .post<Page<never>>("/get/admin/users", {
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      where: whereParams.value,
    })
    .then((res) => {
      pagination.itemCount = res.total;
      users.value = res.records;
    })
    .catch(() => {})
    .finally(() => {
      loading.value.table = false;
    });
}

fetchData(1);
</script>
