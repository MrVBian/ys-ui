<script setup lang="ts">
import { h, ref, reactive } from "vue";

import {
  type FormInst,
  type DataTableColumn,
  NCode,
  NButton,
  NScrollbar,
  NPopconfirm,
} from "naive-ui";
import { renderIcon } from "@/utils/render";
import { Add24Regular } from "@vicons/fluent";
import request, { Page } from "@/utils/request";
import RelativeTime from "@/components/RelativeTime.vue";

const showAddOrEditModal = ref(false);
const currentCheckerId = ref(0);
const loading = ref({
  table: false,
  editBtn: false,
  saveCheckerBtn: false,
});

async function openAddOrEditModal(id: number = 0) {
  try {
    if (id > 0) {
      currentCheckerId.value = id;
      loading.value.editBtn = true;
      checkerModel.value = await request.get<Checker>(
        `/admin/system/judge/checkers/${id}`,
      );
    } else {
      checkerModel.value = {
        id: 0,
        name: "",
        code: "",
      };
    }
    showAddOrEditModal.value = true;
  } catch {
    // pass
  } finally {
    loading.value.editBtn = false;
  }
}

function handleSaveChecker() {
  checkerFormRef.value?.validate().then(async (valid) => {
    if (!valid) return;
    loading.value.saveCheckerBtn = true;
    try {
      if (checkerModel.value.id > 0) {
        await request.put<void>(
          `/admin/system/judge/checkers/${checkerModel.value.id}`,
          checkerModel.value,
        );
      } else {
        await request.post<void>(
          "/admin/system/judge/checkers",
          checkerModel.value,
        );
      }
      currentCheckerId.value = 0;
      fetchData(-1); // 保持当前页码
      showAddOrEditModal.value = false;
    } catch (err: any) {
      window.$notification.error({
        title: err.msg,
        content: () =>
          h(
            NScrollbar,
            {
              xScrollable: true,
            },
            {
              default: () => h(NCode, { code: err.notice }),
            },
          ),
      });
    } finally {
      loading.value.saveCheckerBtn = false;
    }
  });
}

function handleDeleteChecker(id: number) {
  request.delete<void>(`/admin/system/judge/checkers/${id}`).then(() => {
    fetchData();
  });
}

const checkerFormRef = ref<FormInst | null>(null);
const languages = ref([]);
function fetchAllEnabledLanguages() {
  request
    .get<never[]>("/admin/system/judge/languages/enabled")
    .then((res) => {
      languages.value = res;
    })
    .catch(() => {})
    .finally(() => {});
}

interface Checker {
  id: number;
  name: string;
  language_id?: number;
  code: string;
}

const checkerModel = ref<Checker>({
  id: 0,
  name: "",
  code: "",
});

const columns: DataTableColumn[] = [
  {
    title: "检查器ID",
    key: "id",
    align: "center",
    width: 80,
  },
  {
    title: "检查器名称",
    key: "name",
    width: 160,
    ellipsis: true,
  },
  {
    title: "检查器语言",
    key: "edges.language.name",
    align: "center",
    width: 80,
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
    width: 160,
    fixed: "right",
    render({ id }) {
      return h(
        "div",
        { class: "flex items-center justify-center gap-5px" },
        {
          default: () => [
            h(
              NButton,
              {
                secondary: true,
                size: "small",
                type: "info",
                loading: loading.value.editBtn && currentCheckerId.value === id,
                disabled:
                  loading.value.editBtn && currentCheckerId.value !== id,
                onClick: () => openAddOrEditModal(id as number),
              },
              { default: () => "编辑" },
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeleteChecker(id as number),
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
                default: () => "确认删除该检查器吗？",
              },
            ),
          ],
        },
      );
    },
  },
];

const checkers = ref<Checker[]>([]);
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  onChange(page: number) {
    fetchData(page);
  },
});

function fetchData(page = 1) {
  if (page > 0) {
    pagination.page = page;
  }
  loading.value.table = true;
  request
    .get<Page<Checker>>("/admin/system/judge/checkers", {
      page: pagination.page,
      page_size: pagination.pageSize,
    })
    .then((res) => {
      pagination.itemCount = res.total;
      checkers.value = res.records;
    })
    .catch(() => {})
    .finally(() => {
      loading.value.table = false;
    });
}

fetchData();
fetchAllEnabledLanguages();
</script>

<template>
  <n-flex vertical>
    <n-flex>
      <n-button
        type="primary"
        :render-icon="renderIcon(Add24Regular)"
        @click="openAddOrEditModal(0)"
      >
        创建检查器
      </n-button>
    </n-flex>
    <n-data-table
      remote
      :bordered="false"
      :loading="loading.table"
      :data="checkers"
      :columns="columns"
      :pagination="pagination"
      :paginate-single-page="false"
      :scroll-x="850"
    >
      <template #empty>
        <n-empty description="暂无检查器~" />
      </template>
    </n-data-table>
    <n-modal
      preset="card"
      class="w-600px"
      :title="checkerModel.id > 0 ? '编辑检查器' : '创建检查器'"
      v-model:show="showAddOrEditModal"
    >
      <n-form
        ref="checkerFormRef"
        :model="checkerModel"
        :rules="{
          name: [
            {
              required: true,
              message: '检查器名称不能为空',
              trigger: ['input', 'blur'],
            },
          ],
          language_id: [
            {
              type: 'number',
              required: true,
              message: '检查器语言不能为空',
              trigger: ['change'],
            },
          ],
          code: [
            {
              required: true,
              message: '检查器代码不能为空',
              trigger: ['input', 'blur'],
            },
          ],
        }"
      >
        <n-grid :cols="5" :x-gap="16">
          <n-form-item-gi :span="3" label="检查器名称" required path="name">
            <CounterInput v-model:value="checkerModel.name" :maxlength="60" />
          </n-form-item-gi>
          <n-form-item-gi
            :span="2"
            label="检查器语言"
            required
            path="language_id"
          >
            <n-select
              value-field="id"
              label-field="name"
              placeholder="请选择检查器语言"
              v-model:value="checkerModel.language_id"
              :options="languages"
            />
          </n-form-item-gi>
        </n-grid>
        <n-form-item label="检查器代码" required path="code">
          <n-input
            type="textarea"
            :rows="20"
            v-model:value="checkerModel.code"
          />
        </n-form-item>
        <n-form-item :show-label="false" :show-feedback="false">
          <n-flex>
            <n-button
              :loading="loading.saveCheckerBtn"
              type="primary"
              @click="handleSaveChecker"
            >
              保存
            </n-button>
            <n-button @click="() => (showAddOrEditModal = false)">
              取消
            </n-button>
          </n-flex>
        </n-form-item>
      </n-form>
    </n-modal>
  </n-flex>
</template>
