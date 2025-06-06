<script setup lang="ts">
import { h, ref, reactive } from "vue";
import type { DataTableColumn } from "naive-ui";
import { AlertUrgent24Regular } from "@vicons/fluent";
import request, { Page } from "@/utils/request.ts";
import RelativeTime from "@/components/RelativeTime.vue";

interface Announcement {
  id: number;
  title: string;
  create_time: string;
}

const columns: DataTableColumn[] = [
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

function rowProps({ id }: Announcement) {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      window.$message.info(`${id}`);
    },
  };
}

function fetchData(page = 1) {
  pagination.page = page;
  loading.value = true;
  request
    .get<Page<Announcement>>("/home/announcements", {
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    .then((res) => {
      pagination.itemCount = res.total;
      announcements.value = res.records;
    })
    .finally(() => {
      loading.value = false;
    });
}

const loading = ref(false);
const announcements = ref<Announcement[]>([]);
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  onChange(page: number) {
    fetchData(page);
  },
});

fetchData();
</script>

<template>
  <n-card segmented size="small">
    <template #header>
      <text-with-icon>
        <template #icon>
          <n-icon :size="22">
            <AlertUrgent24Regular />
          </n-icon>
        </template>
        公告
      </text-with-icon>
    </template>
    <n-data-table
      remote
      :bordered="false"
      :data="announcements"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      :paginate-single-page="false"
      :row-props="rowProps"
      :scroll-x="500"
    >
      <template #empty>
        <n-empty description="暂无公告~" />
      </template>
    </n-data-table>
  </n-card>
</template>

