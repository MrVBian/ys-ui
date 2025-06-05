<script setup lang="ts">
import { h, ref, reactive } from "vue";

import {
  type FormInst,
  type DataTableColumn,
  NButton,
  NPopconfirm,
  NTag,
  useThemeVars,
} from "naive-ui";
import { renderIcon } from "@/utils/render";
import { Add24Regular, ChevronDown16Filled } from "@vicons/fluent";
import request, { Page } from "@/utils/request";
import RelativeTime from "@/components/RelativeTime.vue";

const themeVars = useThemeVars();

const showAddOrEditModal = ref(false);
const currentLanguageId = ref(0);
const needCompile = ref(false);
const loading = ref({
  table: false,
  editBtn: false,
  saveLanguageBtn: false,
});

async function openAddOrEditModal(id: number = 0) {
  try {
    if (id > 0) {
      currentLanguageId.value = id;
      loading.value.editBtn = true;
      languageModel.value = await request.get(`/admin/languages/${id}`);
      needCompile.value = !!languageModel.value.compile_command;
    } else {
      needCompile.value = false;
      languageModel.value = {
        id: 0,
        name: "",
        compile_command: "",
        compile_envs: [],
        run_command: "",
        run_envs: [],
        src_name: "",
        exe_name: "",
        version: "",
        is_enabled: true,
      };
    }
    showAddOrEditModal.value = true;
  } catch {
    // pass
  } finally {
    loading.value.editBtn = false;
  }
}

function handleSaveLanguage() {
  languageFormRef.value?.validate().then(async (valid) => {
    if (!valid) return;
    loading.value.saveLanguageBtn = true;
    try {
      if (!needCompile.value) {
        languageModel.value.compile_command = "";
        languageModel.value.compile_envs = [];
      }
      if (languageModel.value.id > 0) {
        await request.put<void>(
          `/admin/languages/${languageModel.value.id}`,
          languageModel.value,
        );
      } else {
        await request.post<void>("/admin/languages", languageModel.value);
      }
      currentLanguageId.value = 0;
      fetchData(-1); // 保持当前页码
      showAddOrEditModal.value = false;
    } catch {
      // pass
    } finally {
      loading.value.saveLanguageBtn = false;
    }
  });
}

function handleDeleteLanguage(id: number) {
  request.delete<void>(`/admin/languages/${id}`).then(() => {
    fetchData();
  });
}

const languageFormRef = ref<FormInst | null>(null);

const languageModel = ref({
  id: 0,
  name: "",
  compile_command: "",
  compile_envs: [],
  run_command: "",
  run_envs: [],
  src_name: "",
  exe_name: "",
  version: "",
  is_enabled: true,
});

const columns: DataTableColumn[] = [
  {
    title: "语言ID",
    key: "id",
    align: "center",
    width: 80,
  },
  {
    title: "语言名称",
    key: "name",
    width: 160,
    align: "center",
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "语言版本",
    key: "version",
    align: "center",
    width: 80,
  },
  {
    title: "状态",
    key: "is_enabled",
    align: "center",
    width: 50,
    render({ is_enabled }) {
      return h(
        NTag,
        { type: is_enabled ? "success" : "error" },
        { default: () => (is_enabled ? "启用" : "禁用") },
      );
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
                loading:
                  loading.value.editBtn && currentLanguageId.value === id,
                disabled:
                  loading.value.editBtn && currentLanguageId.value !== id,
                onClick: () => openAddOrEditModal(id as number),
              },
              { default: () => "编辑" },
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeleteLanguage(id as number),
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
                default: () => "确认删除该语言吗？",
              },
            ),
          ],
        },
      );
    },
  },
];

const languages = ref([]);
const pagination = reactive({
  page: 1,
  pageSize: 15,
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

const searchFormCollapsed = ref(true);
const whereParams = ref({
  nameContainsFold: "",
  compileCommandContainsFold: "",
  runCommandContainsFold: "",
  versionContainsFold: "",
  isEnabled: null as boolean | null,
});

function resetSearchForm() {
  whereParams.value = {
    nameContainsFold: "",
    compileCommandContainsFold: "",
    runCommandContainsFold: "",
    versionContainsFold: "",
    isEnabled: null as boolean | null,
  };
  fetchData(1);
}

function fetchData(page = 0, pageSize = 0) {
  if (page > 0) {
    pagination.page = page;
  }
  if (pageSize > 0) {
    pagination.pageSize = pageSize;
  }
  loading.value.table = true;
  request
    .post<Page<never>>("/get/admin/languages", {
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      where: whereParams.value,
    })
    .then((res) => {
      pagination.itemCount = res.total;
      languages.value = res.records;
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
          <n-form-item-gi label="语言名称:" span="6 800:4 1000:3">
            <n-input v-model:value="whereParams.nameContainsFold" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="编译命令:" span="6 800:4 1000:3">
            <n-input
              v-model:value="whereParams.compileCommandContainsFold"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="运行命令:" span="6 800:4 1000:3">
            <n-input
              v-model:value="whereParams.runCommandContainsFold"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="语言版本:" span="6 800:4 1000:3">
            <n-input
              v-model:value="whereParams.versionContainsFold"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="语言状态:" span="6 800:4 1000:3">
            <BoolSelect
              v-model:value="whereParams.isEnabled"
              true-label="启用"
              false-label="禁用"
              :true-color="themeVars.primaryColor"
              :false-color="themeVars.errorColor"
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
        @click="openAddOrEditModal(0)"
      >
        创建语言
      </n-button>
    </n-flex>
    <n-data-table
      remote
      :bordered="false"
      :loading="loading.table"
      :data="languages"
      :columns="columns"
      :pagination="pagination"
      :paginate-single-page="false"
      :scroll-x="800"
    >
      <template #empty>
        <n-empty description="暂无语言~" />
      </template>
    </n-data-table>
    <n-modal
      preset="card"
      class="w-600px"
      :title="languageModel.id > 0 ? '编辑语言' : '创建语言'"
      v-model:show="showAddOrEditModal"
    >
      <n-form
        ref="languageFormRef"
        :model="languageModel"
        :rules="{
          name: [
            {
              required: true,
              message: '语言名称不能为空',
              trigger: ['input', 'blur'],
            },
          ],
          run_command: [
            {
              required: true,
              message: '语言运行命令不能为空',
              trigger: ['input', 'blur'],
            },
          ],
          src_name: [
            {
              required: true,
              message: '源文件名称不能为空',
              trigger: ['input', 'blur'],
            },
          ],
          exe_name: [
            {
              required: true,
              message: '可执行文件名称不能为空',
              trigger: ['input', 'blur'],
            },
          ],
        }"
      >
        <n-grid :cols="2" :x-gap="16">
          <n-form-item-gi label="语言名称" required path="name">
            <CounterInput v-model:value="languageModel.name" :maxlength="60" />
          </n-form-item-gi>
          <n-form-item-gi label="版本" path="version">
            <CounterInput
              v-model:value="languageModel.version"
              :maxlength="60"
            />
          </n-form-item-gi>
        </n-grid>
        <n-grid :cols="2" :x-gap="16">
          <n-form-item-gi label="源文件名称" required path="src_name">
            <CounterInput
              v-model:value="languageModel.src_name"
              :maxlength="60"
            />
          </n-form-item-gi>
          <n-form-item-gi label="可执行文件名称" required path="exe_name">
            <CounterInput
              v-model:value="languageModel.exe_name"
              :maxlength="60"
            />
          </n-form-item-gi>
        </n-grid>
        <n-grid :cols="4" :x-gap="16">
          <n-form-item-gi label="是否启用" required>
            <n-switch v-model:value="languageModel.is_enabled" />
          </n-form-item-gi>
          <n-form-item-gi label="需要编译">
            <n-switch v-model:value="needCompile" />
          </n-form-item-gi>
        </n-grid>
        <template v-if="needCompile">
          <n-form-item label="语言编译命令">
            <n-input v-model:value="languageModel.compile_command" />
          </n-form-item>
          <n-form-item label="语言编译环境变量">
            <StringsInput v-model:value="languageModel.compile_envs" />
          </n-form-item>
        </template>
        <n-form-item label="语言运行命令" required path="run_command">
          <n-input v-model:value="languageModel.run_command" />
        </n-form-item>
        <n-form-item label="语言运行环境变量">
          <StringsInput v-model:value="languageModel.run_envs" />
        </n-form-item>
        <n-form-item :show-label="false" :show-feedback="false">
          <n-flex>
            <n-button
              :loading="loading.saveLanguageBtn"
              type="primary"
              @click="handleSaveLanguage"
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
