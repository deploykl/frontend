import type { RouteRecordRaw } from "vue-router";

const authRoutes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: {
      title: "Login",
      public: true,
      ocultarMenuDash: true,
    },
  },
];

export default authRoutes;
