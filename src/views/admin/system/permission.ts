import type { TreeOption } from "naive-ui";

const treeData: TreeOption[] = [
  {
    key: "admin",
    label: "后台管理",
    children: [
      {
        key: "user",
        label: "用户管理",
        children: [
          {
            key: "admin:user:list",
            label: "查看列表",
          },
          {
            key: "admin:user:create",
            label: "添加用户",
          },
          {
            key: "admin:user:detail",
            label: "查看详情",
          },
          {
            key: "admin:user:reset_password",
            label: "重置密码",
          },
          {
            key: "admin:user:edit",
            label: "编辑用户",
          },
          {
            key: "admin:user:delete",
            label: "删除用户",
          },
        ],
      },
      //   {
      //     key: "role",
      //     label: "角色管理",
      //     children: [],
      //   },
    ],
  },
];

export { treeData };
