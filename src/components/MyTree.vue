<script setup lang="ts">
import { computed } from "vue";
import type { TreeOption } from "naive-ui";
type Key = import("naive-ui/es/tree/src/interface").Key;

const props = defineProps<{
  treeData: TreeOption[];
  value: Key[];
}>();

function travelTree(opts: TreeOption[]): TreeOption[] {
  return opts.map((opt) => {
    if (opt.children && opt.children.length) {
      return {
        ...opt,
        children: travelTree(opt.children),
      };
    }
    return {
      ...opt,
      isLeaf: true,
    };
  });
}

const data = computed(() => travelTree(props.treeData));

const emits = defineEmits(["update:value"]);

function updateCheckedKeys(_: Array<Key>, opts: Array<TreeOption | null>) {
  const values = opts
    .filter((opt) => !!opt && opt.isLeaf)
    .map((opt) => opt!.key);
  emits("update:value", values);
}
</script>

<template>
  <n-tree
    block-line
    cascade
    checkable
    show-line
    default-expand-all
    :selectable="false"
    :data="data"
    :checked-keys="value"
    @update:checked-keys="updateCheckedKeys"
    :override-default-node-click-behavior="
      ({ option }) => (option.children ? 'toggleExpand' : 'toggleCheck')
    "
  />
</template>
