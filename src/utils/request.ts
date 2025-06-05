/* eslint-disable @typescript-eslint/no-explicit-any */
import { toValue } from "@vueuse/core";
import { token, userInfo, useSharedAuthModal } from "@/composables/auth";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export type Options = { url: string } & RequestInit;

export interface Page<T> {
  total: number;
  records: T[];
}

function filterEmpty(obj: Record<string, any>) {
  const res: Record<string, any> = {};
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      res[key] = obj[key];
    }
  }
  return res;
}

export default {
  get<T>(url: string, params?: Record<string, any>) {
    url = url.replace(/[/?]+$/, "");
    if (params) {
      const searchParams = new URLSearchParams(filterEmpty(params));
      if (searchParams.size > 0) url += `?${searchParams.toString()}`;
    }
    return fetchWrap<T>({
      url,
      headers: {},
      method: "GET",
    });
  },
  post<T>(url: string, data?: object) {
    return fetchWrap<T>({
      url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
  put<T>(url: string, data?: object) {
    return fetchWrap<T>({
      url,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
  delete<T>(url: string, params?: Record<string, any>) {
    url = url.replace(/[/?]+$/, "");
    if (params) {
      const searchParams = new URLSearchParams(filterEmpty(params));
      if (searchParams.size > 0) url += `?${searchParams.toString()}`;
    }
    return fetchWrap<T>({
      url,
      headers: {},
      method: "DELETE",
    });
  },
  sse(
    url: string,
    data: object,
    callback: (name: string, data: string) => void,
    onError: () => void = () => {},
  ) {
    const tokenStr = toValue(token);
    const headers = {
      "Content-Type": "application/json",
    };
    if (tokenStr) {
      headers["Authorization"] = `Bearer ${tokenStr}`;
    }
    const ctrl = new AbortController();
    fetchEventSource(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      signal: ctrl.signal,
      async onopen(response) {
        if (response.ok) {
          if (response.headers.get("content-type") === "text/event-stream") {
            return;
          } else {
            onError();
            const data = await response.json();
            if (data.code !== 0) {
              window.$message.error(data.msg);
              if (/* 登录信息过期 */ data.code === 2) {
                userInfo.value = null;
                token.value = null;
                window.$router.push("/").then(() => {
                  setTimeout(() => {
                    useSharedAuthModal().navModalMode.value = 1;
                  }, 200);
                });
              } else if (/* 权限不足 */ data.code === 3) {
                // TODO: 跳转到 403 页面
              }
            }
          }
        }
        ctrl.abort();
      },
      onmessage(ev) {
        if (ev.event === "error") {
          window.$message.error(ev.data);
        } else {
          callback(ev.event, ev.data);
        }
      },
      onclose() {
        ctrl.abort();
      },
    });
  },
  upload<T>(url: string, data: FormData) {
    return fetchWrap<T>({
      url,
      method: "POST",
      body: data,
    });
  },
};

function fetchWrap<T>(options: Options): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    try {
      const tokenStr = toValue(token);
      if (tokenStr) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokenStr}`,
        };
      }
      fetch(`/api/${options.url.replace(/^\/+/, "")}`, options)
        .then((resp) => {
          const refreshToken = resp.headers.get("refresh-token");
          if (refreshToken) {
            token.value = refreshToken;
          }
          const contentType = resp.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return resp.json();
          } else {
            window.$message.error("返回数据格式错误");
            reject("返回数据格式错误");
          }
        })
        .then((data) => {
          if (data.code === 0) {
            resolve(data.data);
            if (
              options.method !== "GET" &&
              !options.url.startsWith("/get/") &&
              data.msg
            ) {
              window.$message.success(data.msg);
            }
          } else {
            reject({ msg: data.msg, notice: data.notice || "" });
            window.$message.error(data.err);
            if (/* 登录信息过期 */ data.code === 2) {
              userInfo.value = null;
              token.value = null;
              window.$router.push("/").then(() => {
                setTimeout(() => {
                  useSharedAuthModal().navModalMode.value = 1;
                }, 200);
              });
            } else if (/* 权限不足 */ data.code === 3) {
              // TODO: 跳转到 403 页面
            }
          }
        });
    } catch (e: any) {
      window.$message.error(e.message);
      reject(e);
    }
  });
}
