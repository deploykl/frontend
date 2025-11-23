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
 
];

export default DIEM_ROUTES;
