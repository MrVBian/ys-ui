<script setup lang="ts">
import { h, ref } from "vue";
import { StarEmphasis24Regular } from "@vicons/fluent";
import request from "@/utils/request.ts";
import type { DataTableColumn } from "naive-ui";
import RelativeTime from "@/components/RelativeTime.vue";

interface Problem {
  display_id: string;
  title: string;
  create_time: string;
}

const columns: DataTableColumn[] = [
  {
    title: "#",
    key: "display_id",
    width: 80,
    align: "center",
  },
  {
    title: "标题",
    key: "title",
    ellipsis: true,
  },
  {
    title: "时间",
    key: "create_time",
    align: "center",
    width: 100,
    render({ create_time }) {
      return h(RelativeTime, {
        time: create_time as string,
      });
    },
  },
];

function rowProps({ display_id }: Problem) {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      window.$message.info(`${display_id}`);
    },
  };
}

const loading = ref(true);
const problems = ref<Problem[]>([]);
request
  .get<Problem[]>("/home/problems")
  .then((res) => {
    problems.value = res;
  })
  .finally(() => {
    loading.value = false;
  });
</script>

<template>
  <n-card segmented size="small">
    <template #header>
      <text-with-icon>
        <template #icon>
          <n-icon :size="22">
            <StarEmphasis24Regular />
          </n-icon>
        </template>
        最新题目
      </text-with-icon>
    </template>
    <n-data-table
      :bordered="false"
      :data="problems"
      :columns="columns"
      :loading="loading"
      :row-props="rowProps"
      :scroll-x="500"
    >
      <n-empty description="暂无题目~" />
    </n-data-table>
  </n-card>
</template>

