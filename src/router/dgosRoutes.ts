import type { RouteRecordRaw } from "vue-router";
import { PERMISSIONS } from "@/components/utils/permissions";

const DGOS_ROUTES: RouteRecordRaw[] = [
  {
    path: "/dgos",
    name: "DGOS",
    component: () => import("@/views/dgos/Index.vue"),
    meta: {
      ocultarMenuDash: true,
      title: "DGOS",
      public: true,
    },
  },
  {
    path: "/dgos/sgd",
    name: "SGD-DGOS",
    component: () => import("@/views/dashboard/Powerbi_SGD_DGOS.vue"),
    meta: {
      title: "Reporte SGD DGOS",
      requiresAuth: true,
      requiredModule: [PERMISSIONS.SGD_GENERAL],
    },
  },
  {
    path: "/dgos/dashboard/personal",
    name: "Tableros Personal DGOS",
    component: () => import("@/views/dashboard/Powerbi_Personal.vue"),
    meta: {
      title: "Dashboard Personal",
      requiresAuth: true,
      requiredModule: [PERMISSIONS.PERSONAL, PERMISSIONS.PERSONAL_LECTURA],
    },
  },
  {
    path: "/dgos/administracion/personal",
    name: "Personal DGOS",
    component: () => import("@/views/dgos/administracion/PersonalView.vue"),
    meta: {
      title: "Personal",
      requiresAuth: true,
      requiredModule: [PERMISSIONS.PERSONAL],
    },
  },
];

export default DGOS_ROUTES;
