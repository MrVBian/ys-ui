<script setup lang="ts">
import { ref, watch, computed } from "vue";
import request, { Page } from "@/utils/request";

const checkers = ref([]);
const languages = ref([]);
const loading = ref(false);
const problemId = computed(() => window.$route.params.problemId);

interface JudgeConfig {
  id: number;

  time_limit: number;
  memory_limit: number;
  stack_limit: number;
  code_length_limit: number;

  checker_id?: number;
  checker_language_id?: number;
  checker_code: string;

  is_file_io: boolean;
  input_file_name: string;
  output_file_name: string;
  is_subtask: boolean;
}

const judgeConfigModel = ref<JudgeConfig>({
  id: 0,
  time_limit: 1000,
  memory_limit: 256,
  stack_limit: 256,
  code_length_limit: 16,
  checker_id: undefined,
  checker_language_id: undefined,
  checker_code: "",
  is_file_io: false,
  input_file_name: "input.txt",
  output_file_name: "output.txt",
  is_subtask: false,
});

function handleSaveBtn() {
  loading.value = true;
  request
    .put<void>(
      `/admin/problems/${problemId.value}/judge_config`,
      judgeConfigModel.value,
    )
    .then(() => {})
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
}
watch(
  () => judgeConfigModel.value.checker_id,
  (newId?: number, oldId?: number) => {
    if (newId && newId > 0) {
      if (newId !== oldId) {
        const checker = checkers.value.find(
          (item: any) => item.id === newId,
        ) as any;
        if (checker) {
          judgeConfigModel.value.checker_language_id = checker.language_id;
          judgeConfigModel.value.checker_code = checker.code;
          return;
        }
      }
    }
    judgeConfigModel.value.checker_id = undefined;
  },
  {
    immediate: true,
  },
);

async function fetchCheckers() {
  try {
    checkers.value = (
      await request.get<Page<never>>("/admin/system/judge/checkers", {
        page: 1,
        page_size: 100,
      })
    ).records;
  } catch {
    // pass
  }
}
async function fetchAllEnabledLanguages() {
  try {
    languages.value = await request.get<never[]>(
      "/admin/system/judge/languages/enabled",
    );
  } catch {
    // pass
  }
}

await Promise.all([fetchCheckers(), fetchAllEnabledLanguages()]);
try {
  judgeConfigModel.value = {
    ...judgeConfigModel.value,
    ...(await request.get<JudgeConfig>(
      `/admin/problems/${problemId.value}/judge_config`,
    )),
  };
} catch {
  // pass
}
</script>

<template>
  <div>
    <n-flex vertical>
      <n-grid :cols="4" :x-gap="10" :y-gap="10" item-responsive>
        <n-form-item-gi
          span="4 300:2 600:1"
          label="时间限制"
          :show-feedback="false"
        >
          <MyInputNumber
            class="w-full"
            v-model:value="judgeConfigModel.time_limit"
            :min="200"
            :max="15000"
          >
            <template #suffix> MS </template>
          </MyInputNumber>
        </n-form-item-gi>
        <n-form-item-gi
          span="4 300:2 600:1"
          label="内存限制"
          :show-feedback="false"
        >
          <MyInputNumber
            class="w-full"
            v-model:value="judgeConfigModel.memory_limit"
            :min="16"
            :max="2048"
          >
            <template #suffix> MiB </template>
          </MyInputNumber>
        </n-form-item-gi>
        <n-form-item-gi
          span="4 300:2 600:1"
          label="栈限制"
          :show-feedback="false"
        >
          <MyInputNumber
            class="w-full"
            v-model:value="judgeConfigModel.stack_limit"
            :min="16"
            :max="2048"
          >
            <template #suffix> MiB </template>
          </MyInputNumber>
        </n-form-item-gi>
        <n-form-item-gi
          span="4 300:2 600:1"
          label="代码长度限制"
          :show-feedback="false"
        >
          <MyInputNumber
            class="w-full"
            v-model:value="judgeConfigModel.code_length_limit"
            :min="1"
            :max="100"
          >
            <template #suffix> KiB </template>
          </MyInputNumber>
        </n-form-item-gi>
      </n-grid>
      <n-grid :cols="4" :x-gap="10" :y-gap="10" item-responsive>
        <n-form-item-gi
          span="4 300:2 600:1"
          label="文件IO"
          :show-feedback="false"
        >
          <n-switch v-model:value="judgeConfigModel.is_file_io" />
        </n-form-item-gi>
        <template v-if="judgeConfigModel.is_file_io">
          <n-form-item-gi
            span="4 300:2 600:1"
            label="输入文件"
            :show-feedback="false"
          >
            <n-input v-model:value="judgeConfigModel.input_file_name" />
          </n-form-item-gi>
          <n-form-item-gi
            span="4 300:2 600:1"
            label="输出文件"
            :show-feedback="false"
          >
            <n-input v-model:value="judgeConfigModel.output_file_name" />
          </n-form-item-gi>
        </template>
      </n-grid>
      <n-flex vertical>
        <n-grid :cols="2" :x-gap="10" :y-gap="10" item-responsive>
          <n-form-item-gi span="2 400:1" label="检查器" :show-feedback="false">
            <n-select
              v-model:value="judgeConfigModel.checker_id"
              clearable
              value-field="id"
              label-field="name"
              placeholder="自定义检查器"
              :options="checkers"
            />
          </n-form-item-gi>
          <n-form-item-gi span="2 400:1" label="语言" :show-feedback="false">
            <n-select
              v-model:value="judgeConfigModel.checker_language_id"
              :disabled="judgeConfigModel.checker_id !== undefined"
              clearable
              value-field="id"
              label-field="name"
              placeholder="请选择检查器语言"
              :options="languages"
            />
          </n-form-item-gi>
        </n-grid>
        <n-form-item label="代码" :show-feedback="false">
          <CodeEditor
            v-model:value="judgeConfigModel.checker_code"
            :disabled="judgeConfigModel.checker_id !== undefined"
          />
        </n-form-item>
      </n-flex>
    </n-flex>
    <n-button
      class="mt-10px"
      :loading="loading"
      type="primary"
      @click="handleSaveBtn"
    >
      保存
    </n-button>
  </div>
</template>
