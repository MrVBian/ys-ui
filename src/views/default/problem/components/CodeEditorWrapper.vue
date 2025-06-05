<script setup lang="ts">
import { ref, watch, computed } from "vue";
import request from "@/utils/request";
import { useSharedProblemAction } from "@/composables/problem";

const problemId = computed(() => window.$route.params.problemId);

interface Language {
  id: number;
  name: string;
}

const languages = ref<Language[]>([]);
function fetchAllEnabledLanguages() {
  request
    .get<Language[]>("/admin/system/judge/languages/enabled")
    .then((res) => {
      languages.value = res;
      if (res.length > 0) currentLanguageId.value = res[0].id;
    })
    .catch(() => {})
    .finally(() => {});
}
const {
  submitting,
  runningOrSubmittingText,
  resultText,
  currentLanguageId,
  currentCode,
  submissionId,
} = useSharedProblemAction();
watch(submitting, (value) => {
  if (value) {
    // window.$message.success("提交成功");
    // submitting.value = false;
    let problem_id = 0;
    try {
      problem_id = parseInt(problemId.value as string);
    } catch {
      // pass
    }
    request.sse(
      "/api/submissions",
      {
        problem_id,
        language_id: currentLanguageId.value,
        code: currentCode.value,
      },
      (name, data) => {
        if (name === "initialized") {
          submissionId.value = data;
        } else if (name === "progress") {
          runningOrSubmittingText.value = data;
        } else if (name === "finished") {
          submitting.value = false;
          resultText.value = data;
        }
      },
      () => {
        submitting.value = false;
        resultText.value = "提交失败";
      },
    );
  }
});
fetchAllEnabledLanguages();
</script>

<template>
  <div class="h-full code-editor-wrapper">
    <n-flex class="mb-5px">
      <n-select
        size="small"
        class="w-120px"
        value-field="id"
        label-field="name"
        placeholder="请选择语言"
        :options="languages"
        v-model:value="currentLanguageId"
      />
    </n-flex>
    <CodeEditor v-model:value="currentCode" class="h-[calc(100%-40px)]" />
  </div>
</template>

<style scoped>
.code-editor-wrapper {
  padding: 10px;
  overflow: hidden;
  box-sizing: border-box;
  border-bottom-left-radius: 3px;
  border-left: 1px solid var(--divider-color);
  border-bottom: 1px solid var(--divider-color);
}
</style>
