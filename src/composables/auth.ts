import { ref } from "vue";
import request from "@/utils/request";
import { useStorage, createSharedComposable } from "@vueuse/core";

export interface UserInfo {
  avatar: string;
  create_time: string;
  email: string;
  id: number;
  nickname: string;
  permissions: string[];
  real_name: string;
  update_time: string;
  username: string;
}

export interface LoginData {
  username: string;
  password: string;
}

const token = useStorage<string>("token", null);
const userInfo = useStorage<UserInfo>("user-info", null, undefined, {
  serializer: {
    read: (v) => (v ? JSON.parse(v) : null),
    write: (v) => JSON.stringify(v),
  },
});

const useSharedAuthModal = createSharedComposable(() => {
  const navModalMode = ref(0);
  return { navModalMode };
});

function userLogin(data: LoginData) {
  return new Promise((resolve, reject) => {
    request
      .post<string>("/auth/login", data)
      .then((res) => {
        token.value = res;
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function userLogout() {
  window.$message.success("退出登录成功");
  userInfo.value = null;
  token.value = null;
  window.$router.push("/");
}

function hasPermissionPrefix(prefix: string) {
  if (!userInfo.value) return false;
  return userInfo.value.permissions.some((p) => p.startsWith(prefix));
}

export {
  token,
  userInfo,
  userLogin,
  userLogout,
  useSharedAuthModal,
  hasPermissionPrefix,
};
