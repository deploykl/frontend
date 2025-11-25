import type { RouteRecordRaw } from "vue-router";
import { PERMISSIONS } from "@/components/utils/permissions";

const DIEM_ROUTES: RouteRecordRaw[] = [
  {
    path: "/diem",
    name: "DIEM",
    component: () => import("@/views/diem/Index.vue"),
    meta: {
      ocultarMenuDash: true,
      title: "DIEM",
      public: true,
    },
  },
  {
    path: "/diem/sgd",
    name: "diem-sgd",
    component: () => import("@/views/dashboard/Powerbi_SGD_DIEM.vue"),
    meta: {
      title: "Reporte SGD DIEM",
      requiresAuth: true,
      requiredModule: [
        PERMISSIONS.ADMIN_DIEM,
        PERMISSIONS.SGD_GENERAL,
      ],
    },
  },
 
];

export default DIEM_ROUTES;
