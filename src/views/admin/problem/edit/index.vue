<script setup lang="ts">
import GeneralInfo from "./GeneralInfo.vue";
import Statement from "./Statement.vue";
import JudgeConfig from "./JudgeConfig.vue";
</script>

<template>
  <n-tabs
    type="line"
    :value="$route.name as string"
    @update:value="(name) => $router.push({ name })"
  >
    <n-tab-pane name="AdminEditProblemBasic" tab="基本信息">
      <MySuspense :bordered="false" description="基本信息加载中...">
        <GeneralInfo />
      </MySuspense>
    </n-tab-pane>
    <n-tab-pane name="AdminEditProblemStatement" tab="题面描述">
      <MySuspense description="题面描述加载中...">
        <Statement />
      </MySuspense>
    </n-tab-pane>
    <n-tab-pane name="AdminEditProblemJudge" tab="评测配置">
      <MySuspense :bordered="false" description="评测配置加载中...">
        <JudgeConfig />
      </MySuspense>
    </n-tab-pane>
  </n-tabs>
</template>
