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
    {
    path: "/admin/personal",
    name: "Personal",
    component: () => import("@/views/dgos/administracion/PersonalView.vue"),
    meta: {
      title: "Lista de Personal",
      requiresAuth: true,
      requiredModule: [PERMISSIONS.PERSONAL, PERMISSIONS.PERSONAL_LECTURA],
    },
  },
];

export default ADMIN_ROUTES;
