<script setup lang="ts">
import Footer from "../common/footer.vue";
</script>

<template>
  <n-layout h-100vh>
    <n-layout-header bordered h-50px flex="~ items-center">
      <router-view name="navbar" />
    </n-layout-header>
    <n-layout class="h-[calc(100vh-50px)]" :native-scrollbar="false">
      <n-layout-content
        :content-style="$route.meta.noPadding ? '' : 'padding: 16px'"
      >
        <router-view />
      </n-layout-content>
      <n-layout-footer v-if="!$route.meta.noFooter" bordered p-15px>
        <Footer />
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>
