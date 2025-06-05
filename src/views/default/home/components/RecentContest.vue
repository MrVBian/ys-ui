<script setup lang="ts">
import { h, reactive, ref } from "vue";
import { NIcon, NPopover } from "naive-ui";
import type { DataTableColumn } from "naive-ui";
import { Trophy24Regular } from "@vicons/fluent";
import { PayCircleOutlined, ClockCircleOutlined } from "@vicons/antd";
import request, { Page } from "@/utils/request.ts";

interface Contest {
  id: number;
  title: string;
  start_time: string;
  duration: string;
  rule_type: string;
  is_rating: boolean;
  status: string;
}

const columns: DataTableColumn[] = [
  {
    title: "标题",
    key: "title",
    ellipsis: true,
  },
  {
    title: "开始时间",
    key: "start_time",
    align: "center",
    width: 180,
  },
  {
    title: "比赛时长",
    key: "duration",
    align: "center",
    width: 100,
  },
  {
    title: "赛制",
    key: "rule_type",
    align: "center",
    width: 150,
    render({ rule_type, is_rating, max_user_rating, is_timed }) {
      let text = `${rule_type}`;
      const children = [h("div", text)];
      if (is_rating) {
        children.push(
          h(NPopover, null, {
            default: () =>
              h("span", `不计Rating的范围: Rating > ${max_user_rating}`),
            header: () => h("strong", "Rating赛"),
            trigger: () =>
              h(
                NIcon,
                {
                  size: 16,
                  class: "text-[--warning-color]",
                },
                { default: () => h(PayCircleOutlined) },
              ),
          }),
        );
      }
      if (is_timed) {
        children.push(
          h(NPopover, null, {
            default: () =>
              h("span", "在起止时间内随到随赛，只限制实际比赛时长"),
            header: () => h("strong", "随到随赛"),
            trigger: () =>
              h(
                NIcon,
                {
                  size: 16,
                  class: "text-[--info-color]",
                },
                { default: () => h(ClockCircleOutlined) },
              ),
          }),
        );
      }
      return h(
        "div",
        {
          class: "flex items-center justify-center gap-5px",
        },
        children,
      );
    },
  },
  {
    title: "状态",
    key: "status",
    align: "center",
    width: 100,
    render({ status }) {
      const statusClass = status === "进行中" ? "bg-green-5" : "bg-blue-5";
      return h(
        "div",
        {
          class: "flex items-center justify-center gap-8px",
        },
        [
          h("div", {
            class: `rounded-full h-7px w-7px ${statusClass}`,
          }),
          h("div", status as string),
        ],
      );
    },
  },
];

const loading = ref(false);
const contests = ref<Contest[]>([]);
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  onChange(page: number) {
    fetchData(page);
  },
});

function rowProps({ id }: Contest) {
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
    .get<Page<Contest>>("/home/contests", {
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    .then((res) => {
      pagination.itemCount = res.total;
      contests.value = res.records;
    })
    .finally(() => {
      loading.value = false;
    });
}

fetchData();
</script>

<template>
  <n-card segmented size="small">
    <template #header>
      <text-with-icon>
        <template #icon>
          <n-icon :size="22">
            <Trophy24Regular />
          </n-icon>
        </template>
        近期比赛
      </text-with-icon>
    </template>
    <n-data-table
      remote
      :bordered="false"
      :data="contests"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      :paginate-single-page="false"
      :row-props="rowProps"
      :scroll-x="800"
    >
      <n-empty description="暂无比赛~" />
    </n-data-table>
  </n-card>
</template>

