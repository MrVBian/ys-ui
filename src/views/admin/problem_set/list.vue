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
          <n-form-item-gi label="题单标题:" span="6 800:4 1000:3">
            <n-input v-model:value="whereParams.titleContainsFold" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="权限类型:" span="6 800:4 1000:3">
            <n-select
              v-model:value="whereParams.authType"
              :options="[
                { label: '公开', value: 'Public' },
                { label: '私有', value: 'Private' },
              ]"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="是否可见:" span="6 800:4 1000:3">
            <BoolSelect
              v-model:value="whereParams.isVisible"
              true-label="可见"
              false-label="隐藏"
              :true-color="themeVars.primaryColor"
              :false-color="themeVars.errorColor"
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
        @click="openAddOrEditModal(0)"
      >
        添加题单
      </n-button>
    </n-flex>
    <n-data-table
      remote
      :loading="loading.table"
      :data="problemSets"
      :columns="columns"
      :pagination="pagination"
      :paginate-single-page="false"
      :scroll-x="1200"
    >
      <template #empty>
        <n-empty description="暂无题单~" />
      </template>
    </n-data-table>
    <n-modal
      preset="card"
      class="w-650px"
      :title="problemSetModel.id > 0 ? '编辑题单' : '创建题单'"
      v-model:show="showAddOrEditModal"
      :mask-closable="false"
    >
      <n-form
        ref="problemSetFormRef"
        :model="problemSetModel"
        :rules="{
          title: [
            {
              required: true,
              message: '题单标题不能为空',
              trigger: ['input', 'blur'],
            },
          ],
          logo: [
            {
              required: true,
              message: '题单封面不能为空',
              trigger: ['change'],
            },
            {
              type: 'url',
              message: '题单封面必须为有效的URL',
              trigger: ['change'],
            },
          ],
        }"
      >
        <n-grid :cols="4" :x-gap="24">
          <n-form-item-gi label="题单标题" required path="title" span="3">
            <CounterInput
              v-model:value="problemSetModel.title"
              :maxlength="60"
            />
          </n-form-item-gi>
          <n-form-item-gi label="是否可见" required path="is_visible">
            <n-switch v-model:value="problemSetModel.is_visible" />
          </n-form-item-gi>
        </n-grid>
        <n-form-item label="题单描述">
          <MarkdownEditor
            v-model:value="problemSetModel.description"
            height="300px"
            mode="edit"
          />
        </n-form-item>
        <n-grid :cols="4" :x-gap="24">
          <n-form-item-gi label="排序">
            <MyInputNumber v-model:value="problemSetModel.order" />
          </n-form-item-gi>
          <n-form-item-gi label="题单类型">
            <n-select
              v-model:value="problemSetModel.auth_type"
              :options="[
                { label: '公开', value: 'Public' },
                { label: '私有', value: 'Private' },
              ]"
            />
          </n-form-item-gi>
          <n-form-item-gi
            v-if="problemSetModel.auth_type === 'Private'"
            label="题单密码"
            span="2"
          >
            <n-input v-model:value="problemSetModel.password" />
          </n-form-item-gi>
        </n-grid>
        <n-form-item label="题单Logo" required path="logo">
          <UploadImage v-model:value="problemSetModel.logo" />
        </n-form-item>
        <n-form-item :show-label="false" :show-feedback="false">
          <n-flex>
            <n-button
              :loading="loading.saveProblemSetBtn"
              type="primary"
              @click="handleSaveProblemSet"
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
    <n-drawer v-model:show="showGroupDrawer" :width="500">
      <n-drawer-content
        :title="`${currentProblemSet.title} - 分组`"
        :native-scrollbar="false"
        closable
      >
        <n-flex vertical>
          <n-flex>
            <n-button
              type="primary"
              :render-icon="renderIcon(Add24Regular)"
              @click="handleAddGroupDialog"
            >
              添加分组
            </n-button>
          </n-flex>
          <n-data-table
            :row-key="(row) => row.id"
            :loading="loading.groupTable"
            :data="problemSetGroups"
            :columns="groupColumns"
          >
            <template #empty>
              <n-empty description="暂无分组~" />
            </template>
          </n-data-table>
        </n-flex>
      </n-drawer-content>
    </n-drawer>
  </n-flex>
</template>

<script setup lang="ts">
import { h, ref, reactive, nextTick, defineComponent } from "vue";
import request, { type Page } from "@/utils/request";
import { renderIcon } from "@/utils/render";
import {
  type FormInst,
  type DataTableColumn,
  NButton,
  NFlex,
  NTag,
  NPopconfirm,
  useThemeVars,
} from "naive-ui";
import RelativeTime from "@/components/RelativeTime.vue";
import Username from "@/components/Username.vue";
import CounterInput from "@/components/CounterInput.vue";
import { Add24Regular, ChevronDown16Filled } from "@vicons/fluent";
import type { MarkdownEditorProps } from "@/components/editor/MarkdownEditor.vue";

const themeVars = useThemeVars();

const loading = ref({
  editBtn: false,
  saveProblemSetBtn: false,
  table: false,
  groupBtn: false,
  groupTable: false,
});

const searchFormCollapsed = ref(true);
const whereParams = ref({
  titleContainsFold: "",
  authType: null as string | null,
  isVisible: null as boolean | null,
  creatorUsernameContains: "",
});

const resetSearchForm = () => {
  whereParams.value = {
    titleContainsFold: "",
    authType: null as string | null,
    isVisible: null as boolean | null,
    creatorUsernameContains: "",
  };
  fetchData(1);
};

const problemSetFormRef = ref<FormInst | null>(null);
const currentProblemSet = ref({
  id: 0,
  title: "",
});
const showAddOrEditModal = ref(false);
const problemSetModel = ref({
  id: 0,
  title: "",
  description: {
    name: "marked",
    raw: "",
    version: "1.0",
    blocks: [],
  } as MarkdownEditorProps,
  auth_type: "Public",
  password: "",
  is_visible: true,
  order: 0,
  logo: "",
});

const showGroupDrawer = ref(false);
async function openGroupDrawer(id: number, title: string) {
  try {
    currentProblemSet.value.id = id;
    currentProblemSet.value.title = title;
    loading.value.groupBtn = true;
    await fetchGroupData();
    showGroupDrawer.value = true;
  } catch {
    // pass
  } finally {
    loading.value.groupBtn = false;
  }
}

async function openAddOrEditModal(id: number = 0) {
  try {
    if (id > 0) {
      currentProblemSet.value.id = id;
      loading.value.editBtn = true;
      problemSetModel.value = await request.get(`/admin/problem_sets/${id}`);
    } else {
      problemSetModel.value = {
        id: 0,
        title: "",
        description: {
          name: "marked",
          raw: "",
          version: "1.0",
          blocks: [],
        } as MarkdownEditorProps,
        auth_type: "Public",
        password: "",
        is_visible: true,
        order: 0,
        logo: "",
      };
    }
    showAddOrEditModal.value = true;
  } catch {
    // pass
  } finally {
    loading.value.editBtn = false;
  }
}

function handleSaveProblemSet() {
  problemSetFormRef.value?.validate().then(async (valid) => {
    if (!valid) return;
    loading.value.saveProblemSetBtn = true;
    try {
      if (problemSetModel.value.id > 0) {
        await request.put<void>(
          `/admin/problem_sets/${problemSetModel.value.id}`,
          problemSetModel.value,
        );
      } else {
        await request.post<void>("/admin/problem_sets", problemSetModel.value);
      }
      fetchData(-1); // 保持当前页码
      showAddOrEditModal.value = false;
    } catch {
      // pass
    } finally {
      loading.value.saveProblemSetBtn = false;
    }
  });
}

function handleDeleteProblemSet(id: number) {
  request
    .delete<void>(`/admin/problem_sets/${id}`)
    .then(() => {
      fetchData();
    })
    .catch(() => {});
}

function handleDeleteProblemSetGroup(id: number) {
  request
    .delete<void>(
      `/admin/problem_sets/${currentProblemSet.value.id}/groups/${id}`,
    )
    .then(() => {
      fetchGroupData();
    })
    .catch(() => {});
}

const columns: DataTableColumn[] = [
  {
    title: "ID",
    key: "id",
    align: "center",
    width: 80,
  },
  {
    title: "标题",
    key: "title",
    align: "center",
    width: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "权限类型",
    key: "auth_type",
    align: "center",
    width: 100,
    render({ auth_type }) {
      return h(
        NTag,
        {
          type: auth_type === "Public" ? "success" : "error",
        },
        {
          default: () => (auth_type === "Public" ? "公开" : "私有"),
        },
      );
    },
  },
  {
    title: "是否可见",
    key: "is_visible",
    align: "center",
    width: 100,
    render({ is_visible }) {
      return h(
        NTag,
        {
          type: is_visible ? "success" : "warning",
        },
        { default: () => (is_visible ? "可见" : "隐藏") },
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
    width: 160,
    fixed: "right",
    render({ id, title }) {
      return h(
        NFlex,
        {
          justify: "center",
          align: "center",
          gap: 12,
        },
        {
          default: () => [
            h(
              NButton,
              {
                size: "small",
                secondary: true,
                type: "info",
                loading:
                  loading.value.editBtn && currentProblemSet.value.id === id,
                disabled:
                  loading.value.editBtn && currentProblemSet.value.id !== id,
                onClick: () => openAddOrEditModal(id as number),
              },
              { default: () => "编辑" },
            ),
            h(
              NButton,
              {
                size: "small",
                secondary: true,
                loading:
                  loading.value.groupBtn && currentProblemSet.value.id === id,
                disabled:
                  loading.value.groupBtn && currentProblemSet.value.id !== id,
                onClick: () => openGroupDrawer(id as number, title as string),
              },
              { default: () => "分组" },
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeleteProblemSet(id as number),
              },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: "small",
                      secondary: true,
                      type: "error",
                    },
                    { default: () => "删除" },
                  ),
                default: () => "确认删除该权限吗？",
              },
            ),
          ],
        },
      );
    },
  },
];

const ShowOrEdit = defineComponent({
  props: {
    value: String,
    onUpdateValue: Function,
  },
  setup(props) {
    const isEdit = ref(false);
    const inputRef = ref<{ focus: () => void } | null>(null);
    const inputValue = ref(props.value);
    function handleOnClick() {
      isEdit.value = true;
      nextTick(() => {
        inputRef.value?.focus();
      });
    }
    function handleChange() {
      props.onUpdateValue?.(inputValue.value);
      isEdit.value = false;
    }
    return () =>
      h(
        "div",
        {
          style: "min-height: 22px",
          onClick: handleOnClick,
        },
        isEdit.value
          ? h(CounterInput, {
              ref: inputRef,
              value: inputValue.value ?? "",
              maxlength: 60,
              onUpdateValue(v) {
                inputValue.value = v;
              },
              onChange: handleChange,
              onBlur: handleChange,
            })
          : props.value,
      );
  },
});

const groupColumns: DataTableColumn[] = [
  {
    title: "名称",
    key: "name",
    align: "center",
    ellipsis: {
      tooltip: true,
    },
    render({ id, name }) {
      return h(ShowOrEdit, {
        value: name as string,
        onUpdateValue(v: string) {
          if (v.length === 0 || v === name) return;
          request
            .put<void>(
              `/admin/problem_sets/${currentProblemSet.value.id}/groups/${id}`,
              { name: v },
            )
            .then(() => {
              fetchGroupData();
            })
            .catch(() => {});
        },
      });
    },
  },
  {
    title: "排序",
    key: "order",
    align: "center",
    width: 100,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    width: 80,
    render({ id }) {
      return h(
        NPopconfirm,
        {
          onPositiveClick: () => handleDeleteProblemSetGroup(id as number),
        },
        {
          trigger: () =>
            h(
              NButton,
              {
                size: "small",
                secondary: true,
                type: "error",
              },
              { default: () => "删除" },
            ),
          default: () => "确认删除该分组吗？",
        },
      );
    },
  },
];

const problemSets = ref([]);
const problemSetGroups = ref([]);
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

function fetchData(page = 0, pageSize = 0) {
  if (page > 0) {
    pagination.page = page;
  }
  if (pageSize > 0) {
    pagination.pageSize = pageSize;
  }
  loading.value.table = true;
  request
    .post<Page<never>>("/get/admin/problem_sets", {
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      where: whereParams.value,
      orders: [{ key: "order", desc: false }],
    })
    .then((res) => {
      pagination.itemCount = res.total;
      problemSets.value = res.records;
    })
    .catch(() => {})
    .finally(() => {
      loading.value.table = false;
    });
}

function fetchGroupData() {
  return new Promise((resolve) => {
    loading.value.groupTable = true;
    request
      .post<Page<never>>(
        `/get/admin/problem_sets/${currentProblemSet.value.id}/groups`,
        {
          offset: 0,
          limit: 1000,
          orders: [{ key: "order", desc: false }],
        },
      )
      .then((res) => {
        problemSetGroups.value = res.records;
      })
      .catch(() => {})
      .finally(() => {
        loading.value.groupTable = false;
        resolve(true);
      });
  });
}

const groupName = ref("");
function handleAddGroupDialog() {
  groupName.value = "";
  const d = window.$dialog.create({
    title: "添加分组",
    showIcon: false,
    style: {
      width: "350px",
      position: "fixed",
      top: "180px",
      right: "75px",
    },
    content: () =>
      h(CounterInput, {
        placeholder: "请输入分组名称",
        value: groupName.value,
        maxlength: 60,
        onUpdateValue: (value) => {
          groupName.value = value;
          d.positiveButtonProps = {
            disabled: !value,
          };
        },
      }),
    positiveText: "保存",
    negativeText: "取消",
    positiveButtonProps: {
      disabled: true,
    },
    onPositiveClick: () => {
      d.loading = true;
      return new Promise((resolve) => {
        request
          .post<void>(
            `/admin/problem_sets/${currentProblemSet.value.id}/groups`,
            {
              name: groupName.value,
            },
          )
          .then(() => {
            resolve(true);
            fetchGroupData();
          })
          .catch(() => {
            resolve(false);
          })
          .finally(() => {
            d.loading = false;
          });
      });
    },
  });
}

fetchData(1);
</script>
