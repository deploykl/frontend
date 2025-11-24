// router/errorRoutes.ts
import type { RouteRecordRaw } from 'vue-router'

const ERROR_ROUTES: RouteRecordRaw[] = [
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/errors/UnauthorizedView.vue'),
    meta: {
      title: 'No Autorizado',
      ocultarMenuDash: true,
      ocultarEnSidebar: true // ← AGREGAR ESTA LÍNEA

    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/errors/NotFoundView.vue"), // Crea esta vista
    meta: {
      title: "Página no encontrada",
      public: true,
      ocultarMenuDash: true,
      ocultarEnSidebar: true // ← AGREGAR ESTA LÍNEA

    },
  },
  //{
  //  path: '/forbidden',
  //  name: 'Forbidden', 
  //  component: () => import('@/views/errors/Forbidden.vue'),
  //  meta: {
  //    title: 'Acceso Denegado',
  //    ocultarMenuDash: true
  //  }
  //},
  //{
  //  path: '/not-found',
  //  name: 'NotFound',
  //  component: () => import('@/views/errors/NotFound.vue'),
  //  meta: {
  //    title: 'Página No Encontrada',
  //    ocultarMenuDash: true
  //  }
  //},
  //{
  //  path: '/server-error',
  //  name: 'ServerError',
  //  component: () => import('@/views/errors/ServerError.vue'),
  //  meta: {
  //    title: 'Error del Servidor',
  //    ocultarMenuDash: true
  //  }
  //},
  //// Catch all route - debe ir al final
  //{
  //  path: '/:pathMatch(.*)*',
  //  name: 'CatchAll',
  //  redirect: '/not-found'
  //}
]

export default ERROR_ROUTES