<script setup lang="ts">
import { h, ref, reactive, computed } from "vue";

import {
  type FormInst,
  type DataTableColumn,
  NFlex,
  NButton,
  NPopconfirm,
} from "naive-ui";
import { renderIcon } from "@/utils/render";
import { Add24Regular, ChevronDown16Filled } from "@vicons/fluent";
import request, { Page } from "@/utils/request";
import RelativeTime from "@/components/RelativeTime.vue";
import ColorfulTag from "@/components/ColorfulTag.vue";

const showAddOrEditModal = ref(false);
const currentDifficultyId = ref(0);
const loading = ref({
  table: false,
  editBtn: false,
  saveDifficultyBtn: false,
});

const searchFormCollapsed = ref(true);
const whereParams = ref({
  nameContainsFold: "",
});

function resetSearchForm() {
  whereParams.value = {
    nameContainsFold: "",
  };
  fetchData(1);
}

async function openAddOrEditModal(id: number = 0) {
  try {
    if (id > 0) {
      currentDifficultyId.value = id;
      loading.value.editBtn = true;
      difficultyModel.value = await request.get(`/admin/difficulties/${id}`);
    } else {
      difficultyModel.value = {
        id: 0,
        name: "",
        light_color: "#000000",
        dark_color: "#FFFFFF",
        order: 0,
        reward_coins: 0,
      };
    }
    showAddOrEditModal.value = true;
  } catch {
    // pass
  } finally {
    loading.value.editBtn = false;
  }
}

function handleSaveDifficulty() {
  difficultyFormRef.value?.validate().then(async (valid) => {
    if (!valid) return;
    loading.value.saveDifficultyBtn = true;
    try {
      if (difficultyModel.value.id > 0) {
        await request.put<void>(
          `/admin/difficulties/${difficultyModel.value.id}`,
          difficultyModel.value,
        );
      } else {
        await request.post<void>("/admin/difficulties", difficultyModel.value);
      }
      fetchData(-1); // 保持当前页码
      showAddOrEditModal.value = false;
    } catch {
      // pass
    } finally {
      loading.value.saveDifficultyBtn = false;
    }
  });
}

function handleDeleteDifficulty(id: number) {
  request.delete<void>(`/admin/difficulties/${id}`).then(() => {
    fetchData();
  });
}

const difficultyFormRef = ref<FormInst | null>(null);

const difficultyModel = ref({
  id: 0,
  name: "",
  light_color: "#000000",
  dark_color: "#FFFFFF",
  order: 0,
  reward_coins: 0,
});

const columns = computed<DataTableColumn[]>(() => [
  {
    title: "ID",
    key: "id",
    align: "center",
    width: 80,
  },
  {
    title: "难度名称",
    key: "name",
    width: 160,
    align: "center",
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "颜色示例",
    key: "color",
    align: "center",
    width: 100,
    render({ name, light_color, dark_color }) {
      return h(
        ColorfulTag,
        { lightColor: light_color as string, darkColor: dark_color as string },
        { default: () => name },
      );
    },
  },
  {
    title: "排序",
    key: "order",
    align: "center",
    width: 80,
  },
  {
    title: "奖励金币",
    key: "reward_coins",
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
    width: 160,
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
                loading:
                  loading.value.editBtn && currentDifficultyId.value === id,
                disabled:
                  loading.value.editBtn && currentDifficultyId.value !== id,
                onClick: () => openAddOrEditModal(id as number),
              },
              { default: () => "编辑" },
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeleteDifficulty(id as number),
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
                default: () => "确认删除该难度吗？",
              },
            ),
          ],
        },
      );
    },
  },
]);

const difficulties = ref([]);
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
    .post<Page<never>>("/get/admin/difficulties", {
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      where: whereParams.value,
      orders: [{ key: "order", desc: false }],
    })
    .then((res) => {
      pagination.itemCount = res.total;
      difficulties.value = res.records;
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
          <n-form-item-gi label="难度名称:" span="6 800:4 1000:3">
            <n-input v-model:value="whereParams.nameContainsFold" clearable />
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
        添加难度
      </n-button>
    </n-flex>
    <n-data-table
      remote
      :loading="loading.table"
      :data="difficulties"
      :columns="columns"
      :pagination="pagination"
      :paginate-single-page="false"
      :scroll-x="800"
    >
      <template #empty>
        <n-empty description="暂无难度~" />
      </template>
    </n-data-table>
    <n-modal
      preset="card"
      class="w-400px fixed top-180px left-[calc(50%-200px)]"
      :title="difficultyModel.id > 0 ? '编辑难度' : '创建难度'"
      v-model:show="showAddOrEditModal"
    >
      <n-form
        ref="difficultyFormRef"
        :model="difficultyModel"
        :rules="{
          name: [
            {
              required: true,
              message: '难度名称不能为空',
              trigger: ['input', 'blur'],
            },
          ],
        }"
      >
        <n-form-item label="难度名称" required path="name">
          <CounterInput v-model:value="difficultyModel.name" :maxlength="60" />
        </n-form-item>
        <n-grid :cols="2" :x-gap="16">
          <n-form-item-gi label="浅色主题" path="light_color">
            <n-color-picker
              v-model:value="difficultyModel.light_color"
              :show-alpha="false"
            />
          </n-form-item-gi>
          <n-form-item-gi label="深色主题" path="dark_color">
            <n-color-picker
              v-model:value="difficultyModel.dark_color"
              :show-alpha="false"
            />
          </n-form-item-gi>
        </n-grid>
        <n-grid :cols="2" :x-gap="16">
          <n-form-item-gi label="排序" path="order">
            <MyInputNumber v-model:value="difficultyModel.order" />
          </n-form-item-gi>
          <n-form-item-gi label="首次AC奖励" path="reward_coins">
            <MyInputNumber
              v-model:value="difficultyModel.reward_coins"
              :min="0"
            />
          </n-form-item-gi>
        </n-grid>
        <n-form-item :show-label="false" :show-feedback="false">
          <n-flex>
            <n-button
              :loading="loading.saveDifficultyBtn"
              type="primary"
              @click="handleSaveDifficulty"
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
