<script setup lang="ts">
import { ref, computed } from "vue";
import request from "@/utils/request";
import { webConfig } from "@/composables/app";
import type { FormInst } from "naive-ui";

const loading = ref(false);
const problemId = computed(() => window.$route.params.problemId);
const generalInfoFormRef = ref<FormInst | null>(null);
const difficultyOptions = computed(() => [
  { label: "未知", value: 0 },
  ...webConfig.value.problem_difficulties.map((item) => ({
    label: item.name,
    value: item.id,
  })),
]);

interface GeneralInfo {
  id: number;
  problem_id: string;
  title: string;
  difficulty: number;
  is_visible: boolean;
  tags: string[];
  source: string;
}

const generalInfo = ref<GeneralInfo>({
  id: 0,
  problem_id: "",
  title: "",
  difficulty: 0,
  is_visible: false,
  tags: [],
  source: "",
});

try {
  generalInfo.value = {
    ...generalInfo.value,
    ...(await request.get<GeneralInfo>(
      `/admin/problems/${problemId.value}/general`,
    )),
  };
} catch {
  // pass
}

function handleSaveBtn() {
  generalInfoFormRef.value?.validate().then((valid) => {
    if (!valid) {
      return;
    }
    loading.value = true;
    request
      .put<void>(
        `/admin/problems/${problemId.value}/general`,
        generalInfo.value,
      )
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        loading.value = false;
      });
  });
}
</script>

<template>
  <n-form
    ref="generalInfoFormRef"
    :model="generalInfo"
    :rules="{
      problem_id: [
        {
          required: true,
          message: '展示ID不能为空',
          trigger: ['input', 'blur'],
        },
      ],
      title: [
        {
          required: true,
          message: '题目名称不能为空',
          trigger: ['input', 'blur'],
        },
      ],
      tags: [
        {
          type: 'array',
          min: 1,
          message: '题目标签不能为空',
          trigger: ['change'],
        },
        {
          type: 'array',
          max: 10,
          message: '最多选择10个标签',
          trigger: ['change'],
        },
      ],
    }"
  >
    <n-form-item label="展示ID" required path="problem_id">
      <CounterInput v-model:value="generalInfo.problem_id" :maxlength="60" />
    </n-form-item>
    <n-form-item label="题目名称" required path="title">
      <CounterInput v-model:value="generalInfo.title" :maxlength="60" />
    </n-form-item>
    <n-form-item label="难度" required path="difficulty">
      <n-select
        v-model:value="generalInfo.difficulty"
        :options="difficultyOptions"
      />
    </n-form-item>
    <n-form-item label="题目标签" required path="tags">
      <n-select
        multiple
        v-model:value="generalInfo.tags"
        filterable
        tag
        :options="[]"
      />
    </n-form-item>
    <n-form-item label="题目来源">
      <n-input v-model:value="generalInfo.source" />
    </n-form-item>
    <n-form-item path="is_visible">
      <template #label> 题目是否可见 </template>
      <n-switch v-model:value="generalInfo.is_visible" />
    </n-form-item>
    <n-form-item :show-label="false" :show-feedback="false">
      <n-button :loading="loading" type="primary" @click="handleSaveBtn">
        保存
      </n-button>
    </n-form-item>
  </n-form>
</template>
