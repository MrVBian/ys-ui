<script setup lang="ts">
import { h, ref, reactive, onErrorCaptured } from "vue";

import {
  type FormInst,
  type DataTableColumn,
  NFlex,
  NTag,
  NButton,
  NPopover,
  NPopconfirm,
} from "naive-ui";
import { renderIcon } from "@/utils/render";
import { Add24Regular, ChevronDown16Filled } from "@vicons/fluent";
import request, { Page } from "@/utils/request";
import RelativeTime from "@/components/RelativeTime.vue";
import ColorfulTag from "@/components/ColorfulTag.vue";
import Username from "@/components/Username.vue";
import type { MarkdownEditorProps } from "@/components/editor/MarkdownEditor.vue";

onErrorCaptured((err, vm, info) => {
  console.error("捕获到子组件错误:", err);
  console.error("错误组件:", vm);
  console.error("错误信息:", info);
  // 返回 false 阻止错误继续向上传播
  return false;
});

const showCreateModal = ref(false);
const currentProblem = ref({
  id: 0,
  problem_id: "",
  title: "",
});
const loading = ref({
  table: false,
  editBtn: false,
  saveProblemBtn: false,
});

type ProblemStatus = "Draft" | "Public" | "Private" | "Disabled";

const searchFormCollapsed = ref(true);
const whereParams = ref({
  problemIDContainsFold: "",
  titleContainsFold: "",
  status: null as ProblemStatus | null,
  creatorUsernameContains: "",
  difficultyID: null as number | null,
  tagNamesContains: null as string | null,
});

function resetSearchForm() {
  whereParams.value = {
    problemIDContainsFold: "",
    titleContainsFold: "",
    status: null as ProblemStatus | null,
    creatorUsernameContains: "",
    difficultyID: null as number | null,
    tagNamesContains: null as string | null,
  };
  fetchData(1);
}

function openCreateModal() {
  createProblemModel.value = {
    problem_id: "",
    title: "",
    difficulty_id: null as number | null,
  };
  showCreateModal.value = true;
}

function handleCreateProblem() {
  problemFormRef.value?.validate().then(async (valid) => {
    if (!valid) return;
    loading.value.saveProblemBtn = true;
    try {
      await request.post<void>(
        "/admin/programing_problems",
        createProblemModel.value,
      );
      fetchData(-1); // 保持当前页码
      showCreateModal.value = false;
    } catch {
      // pass
    } finally {
      loading.value.saveProblemBtn = false;
    }
  });
}

const editProblemFormRef = ref<FormInst | null>(null);
const showEditDrawer = ref(false);

async function openEditDrawer(id: number) {
  try {
    currentProblem.value.id = id;
    loading.value.editBtn = true;
    editProblemModel.value = await request.get(
      `/admin/programing_problems/${id}`,
    );
    showEditDrawer.value = true;
  } catch {
    // pass
  } finally {
    loading.value.editBtn = false;
  }
}

function handleEditProblem(draft = false) {
  if (draft) editProblemModel.value.status = "Draft";
  editProblemFormRef.value?.validate().then(async (valid) => {
    if (!valid) return;
    loading.value.saveProblemBtn = true;
    try {
      await request.put<void>(
        `/admin/programing_problems/${editProblemModel.value.id}`,
        editProblemModel.value,
      );
      fetchData(-1); // 保持当前页码
      showEditDrawer.value = false;
    } catch {
      // pass
    } finally {
      loading.value.saveProblemBtn = false;
    }
  });
}

const showJudgeConfigDrawer = ref(false);

function handleDeleteProblem(id: number) {
  request.delete<void>(`/admin/programing_problems/${id}`).then(() => {
    fetchData();
  });
}

const problemFormRef = ref<FormInst | null>(null);

const createProblemModel = ref({
  problem_id: "",
  title: "",
  difficulty_id: null as number | null,
});
const editProblemModel = ref({
  id: 0,
  problem_id: "",
  title: "",
  statement: {
    name: "marked",
    raw: "",
    version: "1.0",
    blocks: [],
  } as MarkdownEditorProps,
  time_limit: 1000,
  memory_limit: 256,
  stack_limit: 256,
  status: "Draft" as ProblemStatus,
  source: "",
  is_file_io: false,
  input_file_name: "",
  output_file_name: "",
  difficulty_id: null as number | null,
});

const columns: DataTableColumn[] = [
  {
    title: "ID",
    key: "id",
    align: "center",
    width: 80,
  },
  {
    title: "展示ID",
    key: "problem_id",
    align: "center",
    width: 80,
  },
  {
    title: "题目名称",
    key: "title",
    width: 160,
    ellipsis: true,
  },
  {
    title: "题目难度",
    key: "difficulty.name",
    align: "center",
    width: 100,
    render({ difficulty }) {
      return h(
        NPopover,
        {},
        {
          trigger: () =>
            h(
              ColorfulTag,
              {
                lightColor: (difficulty as any).light_color as string,
                darkColor: (difficulty as any).dark_color as string,
              },
              { default: () => (difficulty as any).name },
            ),
          default: () =>
            `首次AC奖励 ${(difficulty as any).reward_coins} 个AC币`,
        },
      );
    },
  },
  {
    title: "状态",
    key: "status",
    align: "center",
    width: 80,
    render({ status }) {
      let type:
        | "default"
        | "error"
        | "primary"
        | "success"
        | "info"
        | "warning" = "default";
      let text = "";
      switch (status) {
        case "Draft":
          type = "info";
          text = "草稿";
          break;
        case "Public":
          type = "primary";
          text = "公开";
          break;
        case "Private":
          type = "warning";
          text = "私有";
          break;
        case "Disabled":
          type = "error";
          text = "禁用";
          break;
        default:
          type = "default";
          text = "未知";
          break;
      }
      return h(
        NTag,
        { type },
        {
          default: () => text,
        },
      );
    },
  },
  {
    title: "创建者",
    key: "creator.username",
    align: "center",
    width: 100,
    render({ creator }) {
      return h(Username, {
        user: creator as any,
        align: "center",
        justify: "center",
        size: "small",
        wrap: false,
      });
    },
  },
  {
    title: "创建时间",
    key: "create_time",
    align: "center",
    width: 100,
    render({ create_time }) {
      return h(RelativeTime, {
        time: create_time as string,
      });
    },
  },
  {
    title: "修改时间",
    key: "update_time",
    align: "center",
    width: 100,
    render({ update_time }) {
      return h(RelativeTime, {
        time: update_time as string,
      });
    },
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    width: 200,
    fixed: "right",
    render({ id, problem_id, title }) {
      return h(
        NFlex,
        { align: "center", justify: "center", size: "small", wrap: false },
        {
          default: () => [
            h(
              NButton,
              {
                secondary: true,
                size: "small",
                type: "info",
                loading:
                  loading.value.editBtn && currentProblem.value.id === id,
                disabled:
                  loading.value.editBtn && currentProblem.value.id !== id,
                onClick: () => openEditDrawer(id as number),
              },
              { default: () => "编辑" },
            ),
            h(
              NButton,
              {
                secondary: true,
                size: "small",
                loading:
                  loading.value.editBtn && currentProblem.value.id === id,
                disabled:
                  loading.value.editBtn && currentProblem.value.id !== id,
                onClick: () => {
                  currentProblem.value = {
                    id: id as number,
                    problem_id: problem_id as string,
                    title: title as string,
                  };
                  showJudgeConfigDrawer.value = true;
                },
              },
              { default: () => "判题配置" },
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeleteProblem(id as number),
              },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      secondary: true,
                      size: "small",
                      type: "error",
                    },
                    { default: () => "删除" },
                  ),
                default: () => "确认删除该题目吗？",
              },
            ),
          ],
        },
      );
    },
  },
];

const problems = ref([]);
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  pageSizes: [10, 15, 30, 50],
  showSizePicker: true,
  prefix({ itemCount }) {
    return `共 ${itemCount} 条`;
  },
  onUpdatePage(page: number) {
    fetchData(page);
  },
  onUpdatePageSize(pageSize: number) {
    fetchData(1, pageSize);
  },
});

function fetchData(page = 0, pageSize = 0) {
  if (page > 0) {
    pagination.page = page;
  }
  if (pageSize > 0) {
    pagination.pageSize = pageSize;
  }
  loading.value.table = true;
  request
    .post<Page<never>>("/get/admin/programing_problems", {
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      where: whereParams.value,
    })
    .then((res) => {
      pagination.itemCount = res.total;
      problems.value = res.records;
    })
    .catch(() => {})
    .finally(() => {
      loading.value.table = false;
    });
}

fetchData(1);
</script>

<template>
  <n-flex vertical>
    <n-card>
      <n-form
        label-placement="left"
        :show-feedback="false"
        @keydown.shift.enter.exact="fetchData(1)"
        label-width="75"
        label-align="left"
      >
        <n-grid
          :cols="12"
          :x-gap="24"
          :y-gap="24"
          :collapsed="searchFormCollapsed"
          item-responsive
        >
          <n-form-item-gi label="展示ID:" span="6 800:4 1000:3">
            <n-input
              v-model:value="whereParams.problemIDContainsFold"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="题目名称:" span="6 800:4 1000:3">
            <n-input v-model:value="whereParams.titleContainsFold" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="题目难度:" span="6 800:4 1000:3">
            <SearchSelect
              api="/get/admin/difficulties"
              v-model:value="whereParams.difficultyID"
              :where="(keyword) => ({ nameContainsFold: keyword })"
              label-field="name"
              value-field="id"
            />
          </n-form-item-gi>
          <n-form-item-gi label="状态:" span="6 800:4 1000:3">
            <n-select
              v-model:value="whereParams.status"
              :options="[
                { label: '草稿', value: 'Draft' },
                { label: '公开', value: 'Public' },
                { label: '私有', value: 'Private' },
                { label: '禁用', value: 'Disabled' },
              ]"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="创建者:" span="6 800:4 1000:3">
            <n-input
              v-model:value="whereParams.creatorUsernameContains"
              clearable
            />
          </n-form-item-gi>
          <n-gi suffix span="6 800:4 1000:3" #="{ overflow }">
            <n-flex justify="end">
              <n-button @click="resetSearchForm()">重置</n-button>
              <n-button
                type="primary"
                :loading="loading.table"
                @click="fetchData(1)"
              >
                查询
              </n-button>
              <n-button
                v-if="overflow || !searchFormCollapsed"
                text
                type="primary"
                @click="searchFormCollapsed = !searchFormCollapsed"
              >
                {{ searchFormCollapsed ? "展开" : "收起" }}
                <n-icon
                  :size="17"
                  :style="{ rotate: searchFormCollapsed ? '0deg' : '180deg' }"
                >
                  <ChevronDown16Filled />
                </n-icon>
              </n-button>
            </n-flex>
          </n-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-flex>
      <n-button
        type="primary"
        :render-icon="renderIcon(Add24Regular)"
        @click="openCreateModal"
      >
        创建题目
      </n-button>
    </n-flex>
    <n-data-table
      remote
      :loading="loading.table"
      :data="problems"
      :columns="columns"
      :pagination="pagination"
      :paginate-single-page="false"
      :scroll-x="1200"
    >
      <template #empty>
        <n-empty description="暂无题目~" />
      </template>
    </n-data-table>
    <n-modal
      preset="card"
      class="w-400px fixed top-180px left-[calc(50%-200px)]"
      title="创建题目"
      v-model:show="showCreateModal"
    >
      <n-form
        ref="problemFormRef"
        :model="createProblemModel"
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
          difficulty_id: [
            {
              required: true,
              type: 'number',
              message: '题目难度不能为空',
              trigger: ['change'],
            },
          ],
        }"
      >
        <n-form-item label="展示ID" required path="problem_id">
          <CounterInput
            v-model:value="createProblemModel.problem_id"
            :maxlength="30"
          />
        </n-form-item>
        <n-form-item label="题目名称" required path="title">
          <CounterInput
            v-model:value="createProblemModel.title"
            :maxlength="60"
          />
        </n-form-item>
        <n-form-item label="题目难度" required path="difficulty_id">
          <SearchSelect
            api="/get/admin/difficulties"
            v-model:value="createProblemModel.difficulty_id"
            :where="(keyword) => ({ nameContainsFold: keyword })"
            label-field="name"
            value-field="id"
          />
        </n-form-item>
        <n-form-item :show-label="false" :show-feedback="false">
          <n-flex>
            <n-button
              :loading="loading.saveProblemBtn"
              type="primary"
              @click="handleCreateProblem"
            >
              保存
            </n-button>
            <n-button @click="() => (showCreateModal = false)">取消</n-button>
          </n-flex>
        </n-form-item>
      </n-form>
    </n-modal>
    <n-drawer
      v-model:show="showEditDrawer"
      :default-width="700"
      :min-width="400"
      :max-width="1000"
      resizable
    >
      <n-drawer-content title="编辑题目" :native-scrollbar="false" closable>
        <n-form ref="editProblemFormRef" :model="editProblemModel">
          <n-grid cols="1 600:3" :x-gap="16">
            <n-form-item-gi label="展示ID" required path="problem_id">
              <CounterInput
                v-model:value="editProblemModel.problem_id"
                :maxlength="30"
              />
            </n-form-item-gi>
            <n-form-item-gi label="标题" required path="title" span="2">
              <CounterInput
                v-model:value="editProblemModel.title"
                :maxlength="60"
              />
            </n-form-item-gi>
            <n-form-item-gi label="时间限制(MS)" required path="time_limit">
              <MyInputNumber
                v-model:value="editProblemModel.time_limit"
                :min="200"
                :max="20000"
                w-full
              >
                <template #suffix> MS </template>
              </MyInputNumber>
            </n-form-item-gi>
            <n-form-item-gi label="内存限制(MiB)" required path="memory_limit">
              <MyInputNumber
                v-model:value="editProblemModel.memory_limit"
                :min="4"
                :max="2048"
                w-full
              />
            </n-form-item-gi>
            <n-form-item-gi label="栈限制(MiB)" required path="stack_limit">
              <MyInputNumber
                v-model:value="editProblemModel.stack_limit"
                :min="4"
                :max="2048"
                w-full
              />
            </n-form-item-gi>
            <n-form-item-gi label="状态:" path="status">
              <n-select
                v-model:value="editProblemModel.status"
                :options="[
                  { label: '草稿', value: 'Draft' },
                  { label: '公开', value: 'Public' },
                  { label: '私有', value: 'Private' },
                  { label: '禁用', value: 'Disabled' },
                ]"
              />
            </n-form-item-gi>
            <n-form-item-gi label="难度" required path="difficulty_id">
              <SearchSelect
                api="/get/admin/difficulties"
                v-model:value="editProblemModel.difficulty_id"
                :where="(keyword) => ({ nameContainsFold: keyword })"
                label-field="name"
                value-field="id"
              />
            </n-form-item-gi>
          </n-grid>
          <n-grid cols="1 600:3" :x-gap="16">
            <n-form-item-gi label="是否文件IO" required path="is_file_io">
              <n-switch v-model:value="editProblemModel.is_file_io" />
            </n-form-item-gi>
            <template v-if="editProblemModel.is_file_io">
              <n-form-item-gi label="输入文件名">
                <CounterInput
                  v-model:value="editProblemModel.input_file_name"
                  :maxlength="60"
                />
              </n-form-item-gi>
              <n-form-item-gi label="输出文件名">
                <CounterInput
                  v-model:value="editProblemModel.output_file_name"
                  :maxlength="60"
                />
              </n-form-item-gi>
            </template>
          </n-grid>
          <n-form-item label="题面" required path="statement">
            <MarkdownEditor
              v-model:value="editProblemModel.statement"
              height="500px"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-flex align="center">
            <n-button
              @click="handleEditProblem(true)"
              :loading="loading.saveProblemBtn"
            >
              存草稿
            </n-button>
            <n-button
              type="primary"
              @click="handleEditProblem()"
              :loading="loading.saveProblemBtn"
            >
              保存
            </n-button>
          </n-flex>
        </template>
      </n-drawer-content>
    </n-drawer>
    <n-drawer
      v-model:show="showJudgeConfigDrawer"
      :default-width="600"
      :min-width="400"
      :max-width="800"
      resizable
    >
      <n-drawer-content
        :title="`${currentProblem.problem_id}.${currentProblem.title} - 判题配置`"
        :native-scrollbar="false"
        closable
      >
        balabala
      </n-drawer-content>
    </n-drawer>
  </n-flex>
</template>
