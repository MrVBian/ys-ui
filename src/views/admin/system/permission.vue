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
          <n-form-item-gi label="权限代码:" span="6 800:4 1000:3">
            <n-input v-model:value="whereParams.codeContainsFold" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="权限名称:" span="6 800:4 1000:3">
            <n-input v-model:value="whereParams.nameContainsFold" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="权限说明:" span="6 800:4 1000:3">
            <n-input
              v-model:value="whereParams.descriptionContainsFold"
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
        添加权限
      </n-button>
    </n-flex>
    <n-data-table
      remote
      :loading="loading.table"
      :data="permissions"
      :columns="columns"
      :pagination="pagination"
      :paginate-single-page="false"
      :scroll-x="1200"
    >
      <template #empty>
        <n-empty description="暂无权限~" />
      </template>
    </n-data-table>
    <n-modal
      preset="card"
      class="w-400px fixed top-180px left-[calc(50%-200px)]"
      :title="permissionModel.id > 0 ? '编辑权限' : '创建权限'"
      v-model:show="showAddOrEditModal"
    >
      <n-form
        ref="permissionFormRef"
        :model="permissionModel"
        :rules="{
          code: [
            {
              required: true,
              message: '权限代码不能为空',
              trigger: ['input', 'blur'],
            },
          ],
          name: [
            {
              required: true,
              message: '权限名称不能为空',
              trigger: ['input', 'blur'],
            },
          ],
        }"
      >
        <n-form-item label="权限代码" required path="code">
          <CounterInput v-model:value="permissionModel.code" :maxlength="60" />
        </n-form-item>
        <n-form-item label="权限名称" required path="name">
          <CounterInput v-model:value="permissionModel.name" :maxlength="60" />
        </n-form-item>
        <n-form-item label="权限说明">
          <CounterInput
            v-model:value="permissionModel.description"
            :maxlength="240"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3 }"
          />
        </n-form-item>
        <n-form-item :show-label="false" :show-feedback="false">
          <n-flex>
            <n-button
              :loading="loading.savePermissionBtn"
              type="primary"
              @click="handleSavePermission"
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

<script setup lang="ts">
import { h, ref, reactive } from "vue";
import request, { Page } from "@/utils/request";
import {
  type FormInst,
  type DataTableColumn,
  NButton,
  NFlex,
  NPopconfirm,
} from "naive-ui";
import RelativeTime from "@/components/RelativeTime.vue";
import { Add24Regular, ChevronDown16Filled } from "@vicons/fluent";
import { renderIcon } from "@/utils/render";

const loading = ref({
  editBtn: false,
  savePermissionBtn: false,
  table: false,
});
const permissionFormRef = ref<FormInst | null>(null);
const showAddOrEditModal = ref(false);
const currentPermissionId = ref(0);
const permissionModel = ref({
  id: 0,
  code: "",
  name: "",
  description: "",
});
async function openAddOrEditModal(id: number = 0) {
  try {
    if (id > 0) {
      currentPermissionId.value = id;
      loading.value.editBtn = true;
      permissionModel.value = await request.get(`/admin/permissions/${id}`);
    } else {
      permissionModel.value = {
        id: 0,
        code: "",
        name: "",
        description: "",
      };
    }
    showAddOrEditModal.value = true;
  } catch {
    // pass
  } finally {
    loading.value.editBtn = false;
  }
}

function handleSavePermission() {
  permissionFormRef.value?.validate().then(async (valid) => {
    if (!valid) {
      return;
    }
    loading.value.savePermissionBtn = true;
    try {
      if (permissionModel.value.id > 0) {
        await request.put<void>(
          `/admin/permissions/${permissionModel.value.id}`,
          permissionModel.value,
        );
      } else {
        await request.post<void>("/admin/permissions", permissionModel.value);
      }
      currentPermissionId.value = 0;
      fetchData(-1); // 保持当前页码
      showAddOrEditModal.value = false;
    } catch {
      // pass
    } finally {
      loading.value.savePermissionBtn = false;
    }
  });
}

function handleDeletePermission(id: number) {
  request.delete<void>(`/admin/permissions/${id}`).then(() => {
    fetchData(-1); // 保持当前页码
  });
}

const columns: DataTableColumn[] = [
  {
    title: "ID",
    key: "id",
    align: "center",
    width: 80,
  },
  {
    title: "权限代码",
    key: "code",
    align: "center",
    width: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "权限名称",
    key: "name",
    align: "center",
    width: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "权限说明",
    key: "description",
    width: 300,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "创建时间",
    key: "create_time",
    align: "center",
    width: 100,
    render({ create_time }) {
      return h(RelativeTime, { time: create_time as string });
    },
  },
  {
    title: "更新时间",
    key: "update_time",
    align: "center",
    width: 100,
    render({ update_time }) {
      return h(RelativeTime, { time: update_time as string });
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
                  loading.value.editBtn && currentPermissionId.value === id,
                disabled:
                  loading.value.editBtn && currentPermissionId.value !== id,
                onClick: () => openAddOrEditModal(id as number),
              },
              { default: () => "编辑" },
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeletePermission(id as number),
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

const searchFormCollapsed = ref(true);
const whereParams = ref({
  codeContainsFold: "",
  nameContainsFold: "",
  descriptionContainsFold: "",
});

const permissions = ref([]);
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

function resetSearchForm() {
  whereParams.value = {
    codeContainsFold: "",
    nameContainsFold: "",
    descriptionContainsFold: "",
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
    .post<Page<never>>("/get/admin/permissions", {
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      where: whereParams.value,
    })
    .then((res) => {
      pagination.itemCount = res.total;
      permissions.value = res.records;
    })
    .catch(() => {})
    .finally(() => {
      loading.value.table = false;
    });
}

fetchData(1);
</script>
