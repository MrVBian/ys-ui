import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/layouts/default/index.vue";
import AdminLayout from "@/layouts/admin/index.vue";
import NavBar from "@/layouts/default/children/navbar.vue";
import { useSharedAuthModal } from "@/composables/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "DefaultLayout",
      component: DefaultLayout,
      children: [
        {
          path: "",
          name: "Home",
          components: {
            default: () => import("@/views/default/home/index.vue"),
            navbar: NavBar,
          },
        },
        {
          path: "course",
          name: "Course",
          components: {
            default: () => import("@/views/default/course/index.vue"),
            navbar: NavBar,
          },
        },
        {
          path: "exam/type/:key/:index?",
          name: "ExamDetail",
          components: {
            default: () => import("@/views/default/exam/index.vue"),
            navbar: () => import("@/views/default/exam/navbar.vue"),
          },
          meta: {
            noFooter: true,
            noPadding: true,
          },
        },
        {
          path: "problems",
          name: "Problems",
          components: {
            default: () => import("@/views/default/problem/index.vue"),
            navbar: NavBar,
          },
        },
        {
          path: "problems/:problemId(\\d+)",
          name: "ProblemDetail",
          components: {
            default: () => import("@/views/default/problem/detail.vue"),
            navbar: () => import("@/views/default/problem/navbar.vue"),
          },
          meta: {
            noFooter: true,
            noPadding: true,
          },
        },
        {
          path: "users/:uid",
          name: "UserDetail",
          components: {
            default: () => import("@/views/default/home/index.vue"),
            navbar: NavBar,
          },
        },
      ],
    },
    {
      path: "/admin",
      name: "AdminLayout",
      component: AdminLayout,
      redirect: { name: "Dashboard" },
      children: [
        {
          path: "dashboard",
          name: "AdminDashboard",
          component: () => import("@/views/default/home/index.vue"),
        },
        {
          path: "languages",
          name: "AdminJudgeLanguages",
          component: () => import("@/views/admin/system/judge/language.vue"),
        },
        {
          path: "system/judge/checkers",
          name: "AdminJudgeCheckers",
          component: () => import("@/views/admin/system/judge/checker.vue"),
        },
        {
          path: "users",
          name: "AdminUsers",
          component: () => import("@/views/admin/system/user.vue"),
        },
        {
          path: "roles",
          name: "AdminRoles",
          component: () => import("@/views/admin/system/role.vue"),
        },
        {
          path: "permissions",
          name: "AdminPermissions",
          component: () => import("@/views/admin/system/permission.vue"),
        },
        {
          path: "programing-problems",
          name: "AdminProgramingProblems",
          component: () => import("@/views/admin/problem/programing.vue"),
        },
        {
          path: "difficulties",
          name: "AdminDifficulties",
          component: () => import("@/views/admin/problem/difficulty.vue"),
        },
        {
          path: "problems/:problemId(\\d+)/basic",
          name: "AdminEditProblemBasic",
          component: () => import("@/views/admin/problem/edit/index.vue"),
          meta: {
            noFooter: true,
          },
        },
        {
          path: "problems/:problemId(\\d+)/statement",
          name: "AdminEditProblemStatement",
          component: () => import("@/views/admin/problem/edit/index.vue"),
          meta: {
            noFooter: true,
          },
        },
        {
          path: "problems/:problemId(\\d+)/judge",
          name: "AdminEditProblemJudge",
          component: () => import("@/views/admin/problem/edit/index.vue"),
          meta: {
            noFooter: true,
          },
        },
        {
          path: "problem-sets",
          name: "AdminProblemSets",
          component: () => import("@/views/admin/problem_set/list.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((_to, _from, next) => {
  useSharedAuthModal().navModalMode.value = 0;
  next();
});

export default router;
