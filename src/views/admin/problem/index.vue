<script setup lang="ts">
import { h, ref, reactive } from "vue";

import {
  type FormInst,
  type DataTableColumn,
  NFlex,
  NButton,
  NPopconfirm,
} from "naive-ui";
import { renderIcon } from "@/utils/render";
import { Add24Regular, ChevronDown16Filled } from "@vicons/fluent";
import { ArchiveOutline as ArchiveIcon } from "@vicons/ionicons5";
import request, { Page } from "@/utils/request";
import { uploadTestcases } from "@/utils/file";
import RelativeTime from "@/components/RelativeTime.vue";

const dragging = ref(false);
const showCreateModal = ref(false);
const showTestcaseDrawer = ref(false);
const currentProblemId = ref(0);
const loading = ref({
  table: false,
  editBtn: false,
  testcaseBtn: false,
  testcaseTable: false,
  saveProblemBtn: false,
});

const searchFormCollapsed = ref(true);
const whereParams = ref({
  problemIdContainsFold: "",
  titleContainsFold: "",
  creatorUsernameContainsFold: "",
});

function resetSearchForm() {
  whereParams.value = {
    problemIdContainsFold: "",
    titleContainsFold: "",
    creatorUsernameContainsFold: "",
  };
  fetchData(1);
}

interface Testcase {
  type: string;
  name: string;
  input_size: string;
  output_size: string;
}

const testcases = ref<Testcase[]>([]);

function fetchTestcases() {
  loading.value.testcaseTable = true;
  request
    .get<Testcase[]>(`/admin/problems/${currentProblemId.value}/testcases`)
    .then((data) => {
      testcases.value = data;
    })
    .catch(() => {})
    .finally(() => {
      loading.value.testcaseTable = false;
    });
}

function handleDeleteTestcase(name: string) {
  request
    .delete<void>(`/admin/problems/${currentProblemId.value}/testcases/${name}`)
    .then(() => {
      fetchTestcases();
    });
}

function handleDrop(e) {
  dragging.value = false;
  uploadTestcases(
    `/admin/problems/${currentProblemId.value}/files`,
    e.dataTransfer.items,
    3,
    100,
  )
    .then((filenames) => {
      if (filenames.length > 0) {
        request
          .put(`/admin/problems/${currentProblemId.value}/testcases`, filenames)
          .then(() => {
            fetchTestcases();
          })
          .catch(() => {
            // pass
          });
      }
    })
    .catch(() => {
      // pass
    });
}

function openCreateModal() {
  createProblemModel.value = {
    problem_id: "",
    title: "",
  };
  showCreateModal.value = true;
}

function handleCreateProblem() {
  problemFormRef.value?.validate().then(async (valid) => {
    if (!valid) return;
    loading.value.saveProblemBtn = true;
    try {
      await request.post<void>("/admin/problems", createProblemModel.value);
      fetchData(-1); // 保持当前页码
      showCreateModal.value = false;
    } catch {
      // pass
    } finally {
      loading.value.saveProblemBtn = false;
    }
  });
}

function handleDeleteProblem(id: number) {
  request.delete<void>(`/admin/problems/${id}`).then(() => {
    fetchData();
  });
}

const problemFormRef = ref<FormInst | null>(null);

const createProblemModel = ref({
  problem_id: "",
  title: "",
});

const columns: DataTableColumn[] = [
  {
    title: "题目ID",
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
    title: "创建者",
    key: "edges.creator.username",
    align: "center",
    width: 100,
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
    render({ id }) {
      return h(
        NFlex,
        { justify: "center", align: "center", gap: 12 },
        {
          default: () => [
            h(
              NButton,
              {
                secondary: true,
                size: "small",
                type: "info",
                loading: loading.value.editBtn && currentProblemId.value === id,
                disabled:
                  loading.value.editBtn && currentProblemId.value !== id,
                onClick: () => {
                  currentProblemId.value = id as number;
                  loading.value.editBtn = true;
                  window.$router.push({
                    name: "AdminEditProblemBasic",
                    params: { problemId: id as number },
                  });
                },
              },
              { default: () => "编辑" },
            ),
            h(
              NButton,
              {
                secondary: true,
                size: "small",
                type: "default",
                loading:
                  loading.value.testcaseBtn && currentProblemId.value === id,
                disabled:
                  loading.value.testcaseBtn && currentProblemId.value !== id,
                onClick: () => {
                  currentProblemId.value = id as number;
                  loading.value.testcaseBtn = true;
                  showTestcaseDrawer.value = true;
                  fetchTestcases();
                },
              },
              { default: () => "测试数据" },
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
              v-model:value="whereParams.problemIdContainsFold"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="题目名称:" span="6 800:4 1000:3">
            <n-input v-model:value="whereParams.titleContainsFold" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="创建者:" span="6 800:4 1000:3">
            <n-input
              v-model:value="whereParams.creatorUsernameContainsFold"
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
        }"
      >
        <n-form-item label="展示ID" required path="problem_id">
          <CounterInput
            v-model:value="createProblemModel.problem_id"
            :maxlength="60"
          />
        </n-form-item>
        <n-form-item label="题目名称" required path="title">
          <CounterInput
            v-model:value="createProblemModel.title"
            :maxlength="60"
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
      v-model:show="showTestcaseDrawer"
      :width="550"
      placement="right"
      @after-leave="
        () => {
          loading.testcaseBtn = false;
          currentProblemId = 0;
        }
      "
    >
      <n-drawer-content title="测试数据">
        <n-data-table
          :loading="loading.testcaseTable"
          :data="testcases"
          :columns="[
            {
              title: '类型',
              key: 'type',
              align: 'center',
              width: 80,
            },
            {
              title: '文件名',
              key: 'name',
              align: 'center',
              width: 120,
            },
            {
              title: '输入大小',
              key: 'input_size',
              align: 'center',
              width: 100,
            },
            {
              title: '输出大小',
              key: 'output_size',
              align: 'center',
              width: 100,
            },
            {
              title: '操作',
              key: 'action',
              align: 'center',
              width: 80,
              render({ name }) {
                return h(
                  NPopconfirm,
                  {
                    onPositiveClick: () => handleDeleteTestcase(name as string),
                  },
                  {
                    trigger: () =>
                      h(
                        NButton,
                        {
                          secondary: true,
                          size: 'small',
                          type: 'error',
                        },
                        { default: () => '删除' },
                      ),
                    default: () => '确认删除该测试数据吗？',
                  },
                );
              },
            },
          ]"
          :pagination="false"
          :scroll-x="500"
        >
          <template #empty>
            <n-empty description="暂无测试数据~" />
          </template>
        </n-data-table>
        <div
          class="mt-4 h-[calc(100vh-300px)] border-2 border-dashed border-gray-300 rounded-lg"
          :class="{ 'border-primary': dragging }"
          @dragenter.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <div class="h-full flex flex-col items-center justify-center">
            <n-icon :component="ArchiveIcon" :size="48" class="text-gray-400" />
            <p class="mt-4 text-gray-500">拖拽文件到此处上传</p>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </n-flex>
</template>

<style scoped>
.dragging * {
  pointer-events: none;
}
</style>
