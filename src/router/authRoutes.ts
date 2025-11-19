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
  {
    path: "/change-password",
    name: "change-password",
    component: () => import("@/views/auth/ChangePasswordView.vue"),
    meta: {
      title: "Cambiar Contraseña",
      requiresAuth: true,
            public: true,

    },
  },
];

export default authRoutes;
