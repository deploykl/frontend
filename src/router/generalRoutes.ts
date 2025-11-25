import type { RouteRecordRaw } from "vue-router";
import { PERMISSIONS } from "@/components/utils/permissions";

const GENERAL_ROUTES: Array<RouteRecordRaw> = [
  {
    path: "/general",
    name: "General",
    component: () => import("@/views/general/Index.vue"),
    meta: {
      title: "General",
      public: true,
      ocultarMenuDash: true,
    },
  },
  {
      path: "/dgos/general/dashboard",
      name: "Reporte-SGD-General",
      component: () => import("@/views/dashboard/Powerbi_SGD_GENERAL.vue"),
      meta: {
        title: "Reporte SGD General",
        requiresAuth: true,
        requiredModule: [PERMISSIONS.SGD_GENERAL],
      },
    },
  {
    path: "/general/anexos",
    name: "Anexos",
    component: () => import("@/views/general/PageAnexos.vue"),
    meta: {
      requiresAuth: true,
      title: "Anexos",
    },
  },
  {
    path: "/general/birthday",
    name: "Cumpleaños",
    component: () => import("@/views/general/PageCumpleaños.vue"),
    meta: {
      title: "Cumpleaños",
      requiresAuth: true,
    },
  },
];

export default GENERAL_ROUTES;
