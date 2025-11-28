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
    path: "/dgos/administracion/personal/list",
    name: "Personal DGOS",
    component: () => import("@/views/dgos/administracion/PersonalListView.vue"),
    meta: {
      title: "Lista de Personal",
      requiresAuth: true,
      requiredModule: [PERMISSIONS.PERSONAL, PERMISSIONS.PERSONAL_LECTURA],
    },
  },
   {
    path: "/dgos/administracion/dashboard",
    name: "Presupuesto",
    component: () => import("@/views/dashboard/PowerBi_Presupuesto.vue"),
    meta: {
      title: "Dashboard Presupuesto",
      requiresAuth: true,
      requiredModule: [PERMISSIONS.SGD_GENERAL],
    },
  },
   {
    path: "/dgos/planeamiento/dashboard",
    name: "POI",
    component: () => import("@/views/dashboard/Powerbi_POI.vue"),
    meta: {
      title: "Dashboard POI",
      requiresAuth: true,
      requiredModule: [PERMISSIONS.SGD_GENERAL],
    },
  },
];

export default DGOS_ROUTES;
