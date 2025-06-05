<script setup lang="ts">
import { h, ref, reactive } from "vue";

import { renderIcon } from "@/utils/render";
import {
  Add24Regular,
  AlertOn24Regular,
  ChevronDown16Filled,
} from "@vicons/fluent";
import request, { Page } from "@/utils/request";
import {
  type FormInst,
  type DataTableColumn,
  NTag,
  NFlex,
  NButton,
  NPopconfirm,
} from "naive-ui";
import RelativeTime from "@/components/RelativeTime.vue";
import { treeData } from "./permission";

const roleFormRef = ref<FormInst | null>(null);

const showAddOrEditModal = ref(false);
const loading = ref({
  permissionBtn: false,
  editBtn: false,
  saveRoleBtn: false,
  savePermissionBtn: false,
  table: false,
});
const currentRole = ref({
  id: 0,
  name: "",
  permissions: [] as string[],
});
const showPermissionEditModal = ref(false);

async function openAddOrEditModal(id: number = 0) {
  try {
    if (id > 0) {
      currentRole.value.id = id;
      loading.value.editBtn = true;
      roleModel.value = await request.get(`/admin/roles/${id}`);
    } else {
      roleModel.value = {
        id: 0,
        code: "",
        name: "",
        description: "",
        is_default: false,
      };
    }
    showAddOrEditModal.value = true;
  } catch {
    // pass
  } finally {
    loading.value.editBtn = false;
  }
}
async function openPermissionEditModal(id: number, name: string) {
  try {
    currentRole.value = { id, name, permissions: [] };
    loading.value.permissionBtn = true;
    currentRole.value.permissions = await request.get<string[]>(
      `/admin/roles/${id}/permissions`,
    );
    showPermissionEditModal.value = true;
  } catch {
    // pass
  } finally {
    loading.value.permissionBtn = false;
  }
}

const roleModel = ref({
  id: 0,
  code: "",
  name: "",
  description: "",
  is_default: false,
});

function handleSaveRole() {
  roleFormRef.value?.validate().then(async (valid) => {
    if (!valid) return;
    loading.value.saveRoleBtn = true;
    try {
      if (roleModel.value.id > 0) {
        await request.put<void>(
          `/admin/roles/${roleModel.value.id}`,
          roleModel.value,
        );
      } else {
        await request.post<void>("/admin/roles", roleModel.value);
      }
      currentRole.value.id = 0;
      fetchData(-1); // 保持当前页码
      showAddOrEditModal.value = false;
    } catch {
      // pass
    } finally {
      loading.value.saveRoleBtn = false;
    }
  });
}

function handleSavePermission() {
  if (currentRole.value.id <= 0) {
    return;
  }
  loading.value.savePermissionBtn = true;
  request
    .put<void>(
      `/admin/roles/${currentRole.value.id}/permissions`,
      currentRole.value.permissions,
    )
    .then(() => {
      showPermissionEditModal.value = false;
      currentRole.value = { id: 0, name: "", permissions: [] };
    })
    .catch(() => {})
    .finally(() => {
      loading.value.savePermissionBtn = false;
    });
}

function handleDeleteRole(id: number) {
  request.delete<void>(`/admin/roles/${id}`).then(() => {
    fetchData();
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
    title: "角色代码",
    key: "code",
    align: "center",
    width: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "角色名称",
    key: "name",
    align: "center",
    minWidth: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "角色说明",
    key: "description",
    width: 300,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "是否默认角色",
    key: "is_default",
    align: "center",
    width: 120,
    render({ is_default }) {
      return h(
        NFlex,
        {
          align: "center",
          justify: "center",
          size: "small",
          wrap: false,
        },
        {
          default: () => [
            h(
              NTag,
              { type: is_default ? "success" : "error" },
              {
                default: () => (is_default ? "是" : "否"),
              },
            ),
          ],
        },
      );
    },
  },
  {
    title: "创建时间",
    key: "create_time",
    align: "center",
    width: 130,
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
    width: 130,
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
    width: 240,
    fixed: "right",
    render({ id, name }) {
      return h(
        NFlex,
        {
          align: "center",
          justify: "center",
          size: "small",
          wrap: false,
        },
        {
          default: () => [
            h(
              NButton,
              {
                secondary: true,
                size: "small",
                type: "info",
                loading: loading.value.editBtn && currentRole.value.id === id,
                disabled: loading.value.editBtn && currentRole.value.id !== id,
                onClick: () => openAddOrEditModal(id as number),
              },
              { default: () => "编辑" },
            ),
            h(
              NButton,
              {
                secondary: true,
                size: "small",
                title: id === 1 ? "该角色不可重新分配权限" : "",
                loading:
                  loading.value.permissionBtn && currentRole.value.id === id,
                disabled:
                  id === 1 ||
                  (loading.value.permissionBtn && currentRole.value.id !== id),
                onClick: () =>
                  openPermissionEditModal(id as number, name as string),
              },
              { default: () => "分配权限" },
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeleteRole(id as number),
              },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      title: id === 1 ? "该角色不可删除" : "",
                      secondary: true,
                      size: "small",
                      type: "error",
                      disabled: id === 1,
                    },
                    { default: () => "删除" },
                  ),
                default: () => "确认删除该角色吗？",
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
  permissionsContains: null as string | null,
});

function resetSearchForm() {
  whereParams.value = {
    codeContainsFold: "",
    nameContainsFold: "",
    descriptionContainsFold: "",
    permissionsContains: null as string | null,
  };
  fetchData(1);
}

const roles = ref([]);
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
    .post<Page<never>>("/get/admin/roles", {
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      where: whereParams.value,
    })
    .then((res) => {
      pagination.itemCount = res.total;
      roles.value = res.records;
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
          <n-form-item-gi label="角色代码:" span="6 800:4 1000:3">
            <n-input v-model:value="whereParams.codeContainsFold" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="角色名称:" span="6 800:4 1000:3">
            <n-input v-model:value="whereParams.nameContainsFold" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="包含权限:" span="6 800:4 1000:3">
            <n-tree-select
              block-line
              show-path
              :options="treeData"
              :override-default-node-click-behavior="
                ({ option }) => (option.children ? 'toggleExpand' : 'default')
              "
              v-model:value="whereParams.permissionsContains"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="角色说明:" span="6 800:4 1000:3">
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
        添加角色
      </n-button>
    </n-flex>
    <n-data-table
      remote
      :loading="loading.table"
      :data="roles"
      :columns="columns"
      :pagination="pagination"
      :paginate-single-page="false"
      :scroll-x="1200"
    >
      <template #empty>
        <n-empty description="暂无角色~" />
      </template>
    </n-data-table>
    <n-modal
      preset="card"
      class="w-400px fixed top-180px left-[calc(50%-200px)]"
      :title="roleModel.id > 0 ? '编辑角色' : '创建角色'"
      v-model:show="showAddOrEditModal"
    >
      <n-form
        ref="roleFormRef"
        :model="roleModel"
        :rules="{
          code: [
            {
              required: true,
              message: '角色代码不能为空',
              trigger: ['input', 'blur'],
            },
          ],
          name: [
            {
              required: true,
              message: '角色名称不能为空',
              trigger: ['input', 'blur'],
            },
          ],
        }"
      >
        <n-form-item label="角色代码" required path="code">
          <CounterInput v-model:value="roleModel.code" :maxlength="60" />
        </n-form-item>
        <n-form-item label="角色名称" required path="name">
          <CounterInput v-model:value="roleModel.name" :maxlength="60" />
        </n-form-item>
        <n-form-item label="角色说明">
          <CounterInput
            v-model:value="roleModel.description"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3 }"
            :maxlength="240"
          />
        </n-form-item>
        <n-form-item v-if="roleModel.id !== 1" label="默认角色" class="mb-20px">
          <n-switch v-model:value="roleModel.is_default" />
          <template #feedback>
            <n-text type="info" flex="~ items-center" class="font-size-12px">
              <n-icon :size="14">
                <AlertOn24Regular />
              </n-icon>
              &nbsp;
              <span>若是则会为每个用户都添加该角色</span>
            </n-text>
          </template>
        </n-form-item>
        <n-form-item :show-label="false" :show-feedback="false">
          <n-flex>
            <n-button
              :loading="loading.saveRoleBtn"
              type="primary"
              @click="handleSaveRole"
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
    <n-modal
      preset="card"
      class="w-400px"
      :title="`${currentRole.name} - 权限分配`"
      v-model:show="showPermissionEditModal"
    >
      <n-scrollbar style="max-height: 500px; margin-bottom: 20px">
        <MyTree :treeData="treeData" v-model:value="currentRole.permissions" />
      </n-scrollbar>
      <n-flex>
        <n-button
          :loading="loading.savePermissionBtn"
          type="primary"
          @click="handleSavePermission"
        >
          保存
        </n-button>
        <n-button @click="() => (showPermissionEditModal = false)">
          取消
        </n-button>
      </n-flex>
    </n-modal>
  </n-flex>
</template>
