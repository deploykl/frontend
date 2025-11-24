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
    path: "/dgos/dashboard/personal",
    name: "Tableros Personal DGOS",
    component: () => import("@/views/dgos/dashboard/Powerbi_Personal.vue"),
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
