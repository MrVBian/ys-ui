<script setup lang="ts">
import { h, ref, reactive, watch } from "vue";
import {
  NButton,
  NDivider,
  NEl,
  NFlex,
  NIcon,
  NInput,
  NInputGroup,
  NPopover,
} from "naive-ui";
import type { DataTableColumn } from "naive-ui";
import { percent } from "@/utils/math.ts";
import { webConfig } from "@/composables/app";
import { Search24Regular } from "@vicons/fluent";
import request, { Page } from "@/utils/request";
import DifficultyRadio from "./components/DifficultyRadio.vue";

interface Problem {
  id: number;
  problem_id: string;
  title: string;
  difficulty: number;
  accepted_user_count: number;
  accepted: number;
  submitted: number;
}

const filterSorterParams = reactive({
  sortKey: "",
  sortAscend: true,
  difficulty: 0,
  keyword: "",
});

const columnsRef = ref<DataTableColumn[]>([
  {
    title: "题目ID",
    key: "problem_id",
    width: 140,
    align: "center",
  },
  {
    title: "题目标题",
    key: "title",
    ellipsis: true,
    filter: true,
    filterOptionValue: undefined,
    filterOptions: [],
    renderFilterMenu({ hide }) {
      let keywordValue = filterSorterParams.keyword;
      const clear = () => {
        filterSorterParams.keyword = "";
        (
          columnsRef.value[1] as { filterOptionValue?: string }
        ).filterOptionValue = undefined;
        hide();
      };
      const confirm = () => {
        filterSorterParams.keyword = keywordValue;
        if (keywordValue === "") {
          (
            columnsRef.value[1] as { filterOptionValue?: string }
          ).filterOptionValue = undefined;
        } else {
          (
            columnsRef.value[1] as { filterOptionValue?: string }
          ).filterOptionValue = "";
        }
        hide();
      };
      return h(NInputGroup, null, {
        default: () => [
          h(NInput, {
            placeholder: "搜索题目、标签",
            clearable: true,
            defaultValue: keywordValue,
            onClear: clear,
            onUpdateValue: (value: string) => {
              keywordValue = value;
            },
          }),
          h(NButton, { onClick: confirm }, { default: () => "确认" }),
        ],
      });
    },
    renderFilterIcon() {
      return h(NIcon, { size: 16 }, { default: () => h(Search24Regular) });
    },
  },
  {
    title: "难度",
    key: "difficulty",
    align: "center",
    width: 140,
    sortOrder: false,
    sorter: true,
    filter: true,
    filterOptions: [],
    filterMultiple: false,
    render({ difficulty }) {
      const entity = webConfig.value.problem_difficulties.find(
        (item) => item.id === difficulty,
      );
      if (entity) {
        return h("span", { style: { color: entity.color } }, entity.name);
      } else {
        return h("span", "未知");
      }
    },
    renderFilterMenu({ hide }) {
      let difficulty = filterSorterParams.difficulty;
      const clear = () => {
        filterSorterParams.difficulty = 0;
        (
          columnsRef.value[2] as { filterOptionValue?: number }
        ).filterOptionValue = undefined;
        hide();
      };
      const confirm = () => {
        filterSorterParams.difficulty = difficulty;
        if (difficulty === 0) {
          (
            columnsRef.value[2] as { filterOptionValue?: number }
          ).filterOptionValue = undefined;
        } else {
          (
            columnsRef.value[2] as { filterOptionValue?: number }
          ).filterOptionValue = difficulty;
        }
        hide();
      };
      return h(NEl, null, {
        default: () =>
          h(
            NFlex,
            { vertical: true },
            {
              default: () => [
                h(DifficultyRadio, {
                  defaultValue: difficulty,
                  class: "px-10px pt-10px",
                  onUpdateValue(value: number) {
                    difficulty = value;
                  },
                }),
                h(NDivider, { class: "my-0!" }),
                h(
                  NFlex,
                  { class: "px-10px pb-10px", align: "center" },
                  {
                    default: () => [
                      h(
                        NButton,
                        { onClick: clear, size: "tiny" },
                        { default: () => "重置" },
                      ),
                      h(
                        NButton,
                        { onClick: confirm, size: "tiny", type: "primary" },
                        { default: () => "确认" },
                      ),
                    ],
                  },
                ),
              ],
            },
          ),
      });
    },
  },
  {
    title: "通过人数",
    key: "accepted_user_count",
    align: "center",
    width: 140,
    sortOrder: false,
    sorter: true,
  },
  {
    title: "通过率",
    key: "accepted_rate",
    align: "center",
    width: 140,
    render({ accepted, submitted }) {
      return h(NPopover, null, {
        header: () =>
          h("div", { class: "text-center font-500" }, "通过数 / 提交数"),
        default: () =>
          h("div", { class: "text-center" }, `${accepted} / ${submitted}`),
        trigger: () =>
          h("span", percent(accepted as number, submitted as number)),
      });
    },
  },
]);

const loading = ref(false);
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  onChange(page: number) {
    fetchData(page);
  },
});
const problems = ref<Problem[]>([]);

function handleSorterChange(options: any) {
  columnsRef.value.forEach((column: any) => {
    /** column.sortOrder !== undefined means it is uncontrolled */
    if (column.sortOrder === undefined) return;
    if (!options) {
      column.sortOrder = false;
      return;
    }
    if (column.key === options.columnKey) column.sortOrder = options.order;
    else column.sortOrder = false;
  });
  if (options.order === "ascend") {
    filterSorterParams.sortKey = options.columnKey;
    filterSorterParams.sortAscend = true;
  } else if (options.order === "descend") {
    filterSorterParams.sortKey = options.columnKey;
    filterSorterParams.sortAscend = false;
  } else {
    filterSorterParams.sortKey = "";
  }
}

function rowProps({ id }: Problem) {
  return {
    style: "cursor: pointer",
    onClick() {
      window.$router.push({ name: "ProblemDetail", params: { problemId: id } });
    },
  };
}

watch(
  filterSorterParams,
  () => {
    fetchData();
  },
  {
    immediate: true,
  },
);

function fetchData(page = 1) {
  if (page > 0) {
    pagination.page = page;
  }
  loading.value = true;
  request
    .get<Page<Problem>>("/problems", {
      page: pagination.page,
      page_size: pagination.pageSize,
      ...filterSorterParams,
    })
    .then((res) => {
      pagination.itemCount = res.total;
      problems.value = res.records;
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <n-grid :cols="4" item-responsive :x-gap="10" :y-gap="10">
    <n-grid-item span="4 1130:3">
      <n-tabs v-if="false">
        <n-tab-pane name="ALL" tab="全部" />
        <n-tab-pane name="HDU" tab="HDU" />
        <n-tab-pane name="POJ" tab="POJ" />
        <n-tab-pane name="VJ" tab="VJ" />
        <n-tab-pane name="CF" tab="CF" />
        <n-tab-pane name="LC" tab="LC" />
        <n-tab-pane name="SP" tab="SP" />
        <n-tab-pane name="ZOJ" tab="ZOJ" />
        <n-tab-pane name="UVA" tab="UVA" />
        <n-tab-pane name="SGU" tab="SGU" />
        <n-tab-pane name="URAL" tab="URAL" />
        <n-tab-pane name="HR" tab="HR" />
        <n-tab-pane name="AC" tab="AC" />
        <n-tab-pane name="CC" tab="CC" />
        <n-tab-pane name="OTHER" tab="其他" />
      </n-tabs>
      <n-data-table
        remote
        :loading="loading"
        :columns="columnsRef"
        :data="problems"
        :pagination="pagination"
        :paginate-single-page="false"
        @update:sorter="handleSorterChange"
        :row-props="rowProps"
        :scroll-x="800"
      >
        <template #empty>
          <n-empty description="暂无题目~" />
        </template>
      </n-data-table>
    </n-grid-item>
    <n-grid-item span="4 1130:1">
      若已登录，则展示用户近2月提交信息，其他信息还没想好
    </n-grid-item>
  </n-grid>
</template>

