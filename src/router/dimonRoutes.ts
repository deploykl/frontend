import type { RouteRecordRaw } from "vue-router";
import { PERMISSIONS } from "@/components/utils/permissions";

const DIMON_ROUTES: RouteRecordRaw[] = [
  {
    path: "/dimon/tablero",
    name: "Tableros Admin",
    component: () => import("@/views/dimon/dashboard/TablerosAdmin.vue"),
    meta: {
      title: "Tableros Admin",
      requiresAuth: true,
      requiredModule: [
        PERMISSIONS.ADMIN_DIMON,
        PERMISSIONS.MONITOR,
        PERMISSIONS.SGD_GENERAL,
      ],
    },
  },
  {
    path: "/dimon/tablero/monitor",
    name: "Tableros Monitor",
    component: () => import("@/views/dimon/dashboard/TablerosMonitor.vue"),
    meta: {
      title: "Tableros Monitor",
      requiresAuth: true,
      requiredModule: [
        PERMISSIONS.ADMIN_DIMON,
        PERMISSIONS.MONITOR,
        PERMISSIONS.SGD_GENERAL,
      ],
    },
  },
  {
    path: "/dimon/dashboard/sgd",
    name: "dimon-sgd",
    component: () => import("@/views/dimon/dashboard/Powerbi_SGD.vue"),
    meta: {
      title: "SGD DIMON",
      requiresAuth: true,
      requiredModule: [
        PERMISSIONS.ADMIN_DIMON,
        PERMISSIONS.MONITOR,
        PERMISSIONS.SGD_GENERAL,
      ],
    },
  },
  {
    path: "/dimon/dashboard/sgd1",
    name: "dimon-sgd1",
    component: () => import("@/views/dimon/dashboard/Powerbi_SGD1.vue"),
    meta: {
      title: "SGD - DIMON1",
      requiresAuth: true,
      requiredModule: [
        PERMISSIONS.ADMIN_DIMON,
        PERMISSIONS.MONITOR,
        PERMISSIONS.SGD_GENERAL,
      ],
    },
  },
  {
    path: "/dimon/dashboard/sgd2",
    name: "dimon-sgd2",
    component: () => import("@/views/dimon/dashboard/Powerbi_SGD2.vue"),
    meta: {
      title: "SGD - DIMON1",
      requiresAuth: true,
      requiredModule: [
        PERMISSIONS.ADMIN_DIMON,
        PERMISSIONS.MONITOR,
        PERMISSIONS.SGD_GENERAL,
      ],
    },
  },
  {
    path: "/dimon/consulta-externa/dashboard",
    name: "dimon-consulta-externa-dashboad",
    component: () => import("@/views/dimon/consultaExterna/DashboardView.vue"),
    meta: {
      title: "Dashboard Consulta E.",
      requiresAuth: true,
      requiredModule: [PERMISSIONS.CONSULTA_EXTERNA],
    },
  },
  {
    path: "/dimon/consulta-externa/index",
    name: "dimon-consulta-externa",
    component: () => import("@/views/dimon/consultaExterna/IndexView.vue"),
    meta: {
      title: "Consulta Externa",
      requiresAuth: true,
      requiredModule: [PERMISSIONS.CONSULTA_EXTERNA],
    },
  },
  {
    path: "/dimon/consulta-externa/reporte",
    name: "dimon-consulta-externa-reporte",
    component: () => import("@/views/dimon/consultaExterna/ReporteView.vue"),
    meta: {
      title: "Reporte CE",
      requiresAuth: true,
      requiredModule: [PERMISSIONS.CONSULTA_EXTERNA_ADMIN],
    },
  },
  // ... resto de rutas con el mismo patrón
];

export default DIMON_ROUTES;
