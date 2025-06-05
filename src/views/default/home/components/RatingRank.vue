<script setup lang="ts">
import { ref, h } from "vue";
import request from "@/utils/request.ts";
import { NAvatar } from "naive-ui";
import type { DataTableColumn } from "naive-ui";
import { DataHistogram24Regular } from "@vicons/fluent";

interface RatingRank {
  rank: number;
  uid: number;
  username: string;
  avatar: string;
  rating: number;
}

const columns: DataTableColumn[] = [
  {
    title: "#",
    key: "rank",
    width: 80,
    align: "center",
  },
  {
    title: "用户名",
    key: "username",
    ellipsis: true,
    render({ username, avatar }) {
      return h(
        "div",
        {
          class: "flex gap8px items-center whitespace-nowrap",
        },
        [
          avatar
            ? h(NAvatar, {
                round: true,
                src: avatar as string,
                size: "small",
              })
            : h(
                NAvatar,
                {
                  round: true,
                  size: "small",
                },
                {
                  default: () => (username as string)[0].toUpperCase(),
                },
              ),
          h("span", null, {
            default: () => username as string,
          }),
        ],
      );
    },
  },
  {
    title: "积分",
    key: "rating",
    width: 100,
    align: "center",
  },
];

function rowProps({ uid }: RatingRank) {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      window.$message.info(`${uid}`);
    },
  };
}

const loading = ref(true);
const ratingRanks = ref<RatingRank[]>([]);
request
  .get<RatingRank[]>("/home/ranks")
  .then((res) => {
    ratingRanks.value = res;
  })
  .finally(() => {
    loading.value = false;
  });
</script>

<template>
  <n-card segmented size="small">
    <template #header>
      <text-with-icon>
        <template #icon>
          <n-icon :size="22">
            <DataHistogram24Regular />
          </n-icon>
        </template>
        积分榜
      </text-with-icon>
    </template>
    <n-data-table
      :bordered="false"
      :data="ratingRanks"
      :columns="columns"
      :loading="loading"
      :row-props="rowProps"
    >
      <n-empty description="暂无用户~" />
    </n-data-table>
  </n-card>
</template>

