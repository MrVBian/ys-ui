<script setup lang="ts">
import { ref, computed } from "vue";
import request from "@/utils/request";
import TokensRender from "@/components/TokensRender/index.tsx";
import CodeEditorWrapper from "../../problem/components/CodeEditorWrapper.vue";
import type { MarkdownEditorProps } from "@/components/editor/MarkdownEditor.vue";
import {
  TimeOutline,
  HardwareChipOutline,
  LayersOutline,
  CodeWorkingOutline,
} from "@vicons/ionicons5";

const loading = ref(true);
const problemId = computed(() => window.$route.params.problemId);

interface Problem {
  id: number;
  problem_id: string;
  title: string;
  statement: MarkdownEditorProps;
  difficulty: number;
  tags: string[];
  source: string;
  time_limit: number;
  memory_limit: number;
  stack_limit: number;
  code_length_limit: number;
  is_file_io: boolean;
  input_file_name: string;
  output_file_name: string;
}
const problem = ref<Problem>();

request
  .get<Problem>(`/problems/${problemId.value}`)
  .then((res) => {
    problem.value = res;
  })
  .catch(() => {})
  .finally(() => {
    loading.value = false;
  });
</script>

<template>
  <splitpanes style="height: calc(100vh - 50px)">
    <template #1>
      <div class="h-full important-b-rd-0 relative left-panel">
        <n-spin v-if="loading" class="center" description="题面描述加载中..." />
        <n-scrollbar content-style="overflow: hidden; padding: 10px">
          <n-blockquote>
            <n-flex vertical size="small">
              <n-skeleton
                v-if="!problem?.problem_id"
                text
                :height="25.59"
                style="width: 50%"
              />
              <n-h4 v-else class="m-0" flex="~ items-center gap-10px">
                <span>{{ problem?.problem_id }}. {{ problem?.title }}</span>
                <n-tag size="small" :bordered="false">
                  <span class="color-green">简单</span>
                </n-tag>
                <n-popover v-if="problem.is_file_io" trigger="hover">
                  <template #trigger>
                    <n-tag size="small" :bordered="false"> 文件IO </n-tag>
                  </template>
                  <span> 输入文件: {{ problem.input_file_name }} </span>
                  <br />
                  <span> 输出文件: {{ problem.output_file_name }} </span>
                </n-popover>
              </n-h4>
              <n-flex :size="3">
                <n-tag size="small" type="info">
                  <template #icon>
                    <n-icon>
                      <TimeOutline />
                    </n-icon>
                  </template>
                  {{ problem?.time_limit }} MS
                </n-tag>
                <n-tag size="small" type="warning">
                  <template #icon>
                    <n-icon>
                      <HardwareChipOutline />
                    </n-icon>
                  </template>
                  {{ problem?.memory_limit }} MiB
                </n-tag>
                <n-tag size="small" type="warning">
                  <template #icon>
                    <n-icon>
                      <LayersOutline />
                    </n-icon>
                  </template>
                  {{ problem?.stack_limit }} MiB
                </n-tag>
                <n-tag size="small" type="error">
                  <template #icon>
                    <n-icon>
                      <CodeWorkingOutline />
                    </n-icon>
                  </template>
                  {{ problem?.code_length_limit }} KiB
                </n-tag>
              </n-flex>
              <n-flex :size="3">
                <n-tag v-for="(tag, i) of problem?.tags" :key="i" size="small">
                  {{ tag }}
                </n-tag>
              </n-flex>
            </n-flex>
          </n-blockquote>
          <n-divider class="important-my-10px" />
          <TokensRender :blocks="problem?.statement.blocks ?? []" />
        </n-scrollbar>
      </div>
    </template>
    <template #2>
      <splitpanes vertical :min="0.5" :default-size="0.7">
        <template #1>
          <CodeEditorWrapper />
        </template>
        <template #2>
          <div>开发测试区中, 敬请期待...</div>
        </template>
      </splitpanes>
    </template>
  </splitpanes>
</template>

<style scoped>
.left-panel {
  /*noinspection CssUnresolvedCustomProperty*/
  border-right: 1px solid var(--divider-color);
}
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
