<script setup lang="ts">
import { ref, computed } from "vue";
import { type SelectOption } from "naive-ui";
import request, { type Page } from "@/utils/request";

const props = defineProps<{
  value: number | number[] | null;
  api: string;
  where: (keyword: string) => object;
}>();

const emits = defineEmits<{
  (e: "update:value", val: number | number[] | null): void;
}>();

const loading = ref(false);
const options = ref<SelectOption[]>([]);

const innerValue = computed<number | number[] | null>({
  get() {
    return props.value;
  },
  set(val: number | number[] | null) {
    emits("update:value", val);
  },
});

function search(keyword: string) {
  loading.value = true;
  const predicates: object[] = [];
  if (props.value) {
    if (Array.isArray(props.value)) {
      predicates.push({ idIn: props.value });
    } else {
      predicates.push({ id: props.value });
    }
  }
  if (keyword) {
    predicates.push(props.where(keyword));
  }
  request
    .post<Page<never>>(props.api, {
      offset: 0,
      limit: 20,
      where: { or: predicates },
    })
    .then((res) => {
      options.value = res.records;
    })
    .finally(() => {
      loading.value = false;
    });
}

search("");
</script>

<template>
  <n-select
    v-model:value="innerValue"
    filterable
    :options="options"
    :loading="loading"
    clearable
    remote
    v-bind="$attrs"
    @search="search"
  />
</template>
