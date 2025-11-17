import type { RouteRecordRaw } from "vue-router";

const generalRoutes: Array<RouteRecordRaw> = [
  {
    path: "/general",
    name: "General",
    component: () => import("@/views/general/Index.vue"),
    meta: {
      title: "General",
      public: true,
    },
  },
];

export default generalRoutes;
