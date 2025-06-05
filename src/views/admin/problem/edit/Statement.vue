<script setup lang="ts">
import { ref, computed } from "vue";
import request from "@/utils/request";
import type { MarkdownEditorProps } from "@/components/editor/MarkdownEditor.vue";

const loading = ref(false);
const problemId = computed(() => window.$route.params.problemId);
interface Statement {
  id: number;
  statement: MarkdownEditorProps;
}
const statement = ref<Statement>({
  id: 0,
  statement: {
    name: "",
    raw: "",
    version: "",
    blocks: [],
  },
});

try {
  statement.value = {
    ...statement.value,
    ...(await request.get<Statement>(
      `/admin/problems/${problemId.value}/statement`,
    )),
  };
} catch {
  // pass
}

function handleSaveBtn() {
  loading.value = true;
  request
    .put<void>(`/admin/problems/${problemId.value}/statement`, statement.value)
    .then(() => {})
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div>
    <MarkdownEditor v-model:value="statement.statement" class="h-[calc(100vh-177px)]" height="100%" />
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
