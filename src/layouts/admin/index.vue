<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import SiderBar from "./children/siderbar.vue";

const collapsed = useStorage("admin-collapsed", false);
</script>

<template>
  <n-layout h-100vh has-sider>
    <n-layout-sider
      bordered
      :width="200"
      collapse-mode="width"
      show-trigger="bar"
      :collapsed-width="50"
      :collapsed="collapsed"
      @collapse="collapsed = true"
      @expand="collapsed = false"
      :native-scrollbar="false"
    >
      <SiderBar
        :collapsed="collapsed"
        :collapsed-width="50"
        :collapsed-icon-size="20"
      />
    </n-layout-sider>
    <n-layout>
      <n-layout class="h-100vh" :native-scrollbar="false">
        <n-layout-content
          :content-style="
            $route.meta.noPadding ? '' : 'padding: 15px 15px 15px 24px'
          "
        >
          <router-view>
            <template #default="{ Component, route }">
              <transition name="fade-slide" mode="out-in" appear>
                <component :is="Component" :key="route.fullPath" />
              </transition>
            </template>
          </router-view>
        </n-layout-content>
        <!-- <n-layout-footer v-if="!$route.meta.noFooter" bordered p-15px>
          <Footer />
        </n-layout-footer> -->
      </n-layout>
    </n-layout>
  </n-layout>
</template>
