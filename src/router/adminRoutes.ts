import type { RouteRecordRaw } from "vue-router";
import { PERMISSIONS } from "@/components/utils/permissions";

const ADMIN_ROUTES: Array<RouteRecordRaw> = [
  {
    path: "/admin/modulos",
    name: "modulos-admin",
    component: () => import("@/views/admin/ModulosView.vue"),
    meta: {
      title: "Módulos",
      requiresAuth: true,
      requiredModule: [PERMISSIONS.SUPER_USER],
    },
  },
];

export default ADMIN_ROUTES;
