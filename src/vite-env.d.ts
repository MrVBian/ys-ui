/// <reference types="vite/client" />
import type {
  DialogApi,
  LoadingBarApi,
  MessageApi,
  ModalApi,
  NotificationApi,
} from "naive-ui";

declare global {
  interface Window {
    $dialog: DialogApi;
    $loadingBar: LoadingBarApi;
    $message: MessageApi;
    $modal: ModalApi;
    $notification: NotificationApi;
    $route: import("vue-router").RouteLocationNormalized;
    $router: import("vue-router").Router;
  }
  // 条件编译
  const __TRUE__: boolean;
}

declare module "vue-router" {
  interface RouteMeta {
    noPadding?: boolean;
    noFooter?: boolean;
  }
}
