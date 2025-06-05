<script setup lang="ts">
import type { MenuOption } from "naive-ui";
import { renderIcon } from "@/utils/render";

import {
  Alert24Regular,
  Apps24Regular,
  AppsList24Regular,
  Book24Regular,
  BookStar24Regular,
  Channel24Regular,
  ClipboardCode24Regular,
  Code24Regular,
  DataTrending24Regular,
  Home24Regular,
  Person24Regular,
  PersonLock24Regular,
  Settings24Regular,
  Tag24Regular,
  TextBulletListSquareEdit24Regular,
} from "@vicons/fluent";

if (__TRUE__) {
  console.log("true");
}

const menuOptions: MenuOption[] = [
  {
    label: "数据看板",
    key: "AdminDashboard",
    disabled: true,
    icon: renderIcon(DataTrending24Regular),
  },
  {
    label: "首页管理",
    key: "AdminHome",
    disabled: true,
    icon: renderIcon(Home24Regular),
    children: [
      {
        label: "专题推荐",
        key: "AdminSpecialRecommend",
        disabled: true,
        icon: renderIcon(Book24Regular),
      },
      {
        label: "公告管理",
        key: "AdminAnnouncement",
        disabled: true,
        icon: renderIcon(Alert24Regular),
      },
    ],
  },
  {
    label: "题目管理",
    key: "AdminProblem",
    icon: renderIcon(AppsList24Regular),
    children: [
      {
        label: "编程题目",
        key: "AdminProgramingProblems",
        icon: renderIcon(Code24Regular),
      },
      {
        label: "难度管理",
        key: "AdminDifficulties",
        icon: renderIcon(BookStar24Regular),
      },
      {
        label: "标签管理",
        key: "AdminTags",
        icon: renderIcon(Tag24Regular),
      },
      {
        label: "评测记录",
        key: "AdminSubmissions",
        icon: renderIcon(TextBulletListSquareEdit24Regular),
      },
      // {
      //   label: "导入题目",
      //   key: "problem-import",
      // },
      // {
      //   label: "导出题目",
      //   key: "problem-export",
      // },
    ],
  },
  {
    label: "题单管理",
    key: "AdminProblemSet",
    icon: renderIcon(Channel24Regular),
    children: [
      {
        label: "题单列表",
        key: "AdminProblemSets",
      },
    ],
  },
  {
    label: "系统管理",
    key: "AdminSystem",
    icon: renderIcon(Settings24Regular),
    children: [
      {
        label: "用户管理",
        key: "AdminUsers",
        icon: renderIcon(Person24Regular),
      },
      {
        label: "角色管理",
        key: "AdminRoles",
        icon: renderIcon(PersonLock24Regular),
      },
      {
        label: "菜单管理",
        key: "AdminMenus",
        disabled: true,
        icon: renderIcon(Apps24Regular),
      },
      {
        label: "语言管理",
        key: "AdminJudgeLanguages",
        icon: renderIcon(ClipboardCode24Regular),
      },
      {
        label: "检查器管理",
        key: "AdminJudgeCheckers",
        disabled: true,
      },
    ],
  },
];

defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
  collapsedWidth: {
    type: Number,
    default: 60,
  },
  collapsedIconSize: {
    type: Number,
    default: 20,
  },
});
</script>

<template>
  <n-menu
    :value="$route.name as string"
    :collapsed="collapsed"
    :collapsed-width="collapsedWidth"
    :collapsed-icon-size="collapsedIconSize"
    :options="menuOptions"
    :indent="20"
    @update:value="(key) => $router.push({ name: key })"
  />
</template>
