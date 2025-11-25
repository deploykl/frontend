// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import GENERAL_ROUTES from "./generalRoutes";
import authRoutes from "./authRoutes";
import DIEM_ROUTES from "./diemRoutes";
import DIMON_ROUTES from "./dimonRoutes";
import DGOS_ROUTES from "./dgosRoutes";
import ERROR_ROUTES from "./errorRoutes";
import { PERMISSIONS } from '@/components/utils/permissions';

const mainRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    meta: { 
      ocultarMenuDash: true,
      public: true
    },
  },
  {
    path: "/noticias",
    name: "Noticias",
    component: () => import("@/views/noticias/IndexView.vue"),
    meta: {
      title: "Noticias",
            requiresAuth: true,
      requiredModule: [PERMISSIONS.GENERAL],

    },
  },
];

// Combinar todas las rutas
const routes: Array<RouteRecordRaw> = [
  ...mainRoutes,
  ...DIEM_ROUTES,
  ...DIMON_ROUTES,
  ...DGOS_ROUTES,
  ...ERROR_ROUTES,
  ...GENERAL_ROUTES,
  ...authRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Función mejorada para verificar módulos (case-insensitive y con soporte para múltiples)
const hasModuleAccess = (
  moduleNames: string | string[] | undefined,
  userModulos: string[]
): boolean => {
  if (!moduleNames) return true;

  // Si es string, convertirlo a array
  const modulesToCheck =
    typeof moduleNames === "string"
      ? moduleNames.split(",").map((m) => m.trim().toLowerCase())
      : Array.isArray(moduleNames)
      ? moduleNames.map((m) => m.toLowerCase())
      : [];

  if (modulesToCheck.length === 0) return true;

  const userModules = userModulos.map((m) => m.toLowerCase());

  // Verifica si al menos uno de los módulos existe en los módulos del usuario
  return modulesToCheck.some((module) => userModules.includes(module));
};

// 🔹 Guardia global de navegación mejorada
router.beforeEach(async (to, _from, next) => {
  // ✅ PRIMERO: Excluir rutas API
  if (to.path.startsWith("/api/")) {
    console.log("🚫 Ruta API excluida del router Vue:", to.path);
    return; // NO llamar next()
  }

  const isAuthenticated = localStorage.getItem("auth_token");
  const requiresPasswordChange = 
    localStorage.getItem("requires_password_change") === "true";

  console.log(
    "Navegando a:",
    to.name,
    "| Path:",
    to.path,
    "| Password change required:",
    requiresPasswordChange
  );

  // 🔹 PRIMERO: Manejar cambio de contraseña REQUERIDO
  if (requiresPasswordChange && to.name !== "change-password") {
    console.log("🔁 Redirigiendo a change-password (cambio requerido)");
    return next("/change-password");
  }

  // 🔹 SEGUNDO: Si ya está en change-password y requiere cambio, permitir acceso
  if (requiresPasswordChange && to.name === "change-password") {
    console.log("✅ Acceso directo a change-password permitido");
    return next();
  }

  // 🔹 TERCERO: Si la ruta es pública
  if (to.meta?.public) {
    return next();
  }

  // 🔹 CUARTO: Si no está autenticado y la ruta requiere auth
  if (to.meta?.requiresAuth && !isAuthenticated) {
    localStorage.setItem("redirectAfterLogin", to.fullPath);
    return next({
      path: "/login",
      query: { error: "no-access" },
    });
  }

  // 🔹 QUINTO: Si intenta acceder a login ya estando autenticado
  if (to.name === "login" && isAuthenticated) {
    return next("/noticias");
  }

  // 🔹 SEXTO: Si intenta acceder a change-password sin necesitarlo
  if (to.name === "change-password" && !requiresPasswordChange && isAuthenticated) {
    return next("/noticias");
  }

  // 🔹 SÉPTIMO: Verificación de permisos por módulos (solo si está autenticado)
  if (to.meta?.requiresAuth && isAuthenticated) {
    const userModulos = JSON.parse(localStorage.getItem("user_modulos") || "[]");
    const isSuperuser = localStorage.getItem("is_superuser") === "true";

    // 1. Si es superusuario, permite acceso a todo
    if (isSuperuser) {
      console.log("Acceso concedido: usuario superuser");
      return next();
    }

    // 2. Verificación de módulos
    const requiredModule = to.meta.requiredModule as string | string[] | undefined;
    if (requiredModule !== undefined) {
      const hasAccess = hasModuleAccess(requiredModule, userModulos);

      if (!hasAccess) {
        console.warn(
          `Acceso denegado a ${to.path}. Módulos requeridos: ${
            to.meta.requiredModule
          }. Usuario tiene: ${userModulos.join(", ") || "ninguno"}`
        );
        return next("/unauthorized");
      }
    }

    // 3. Verificación adicional para rutas administrativas
    if (to.path.startsWith("/admin") && !isSuperuser) {
      console.warn("Acceso denegado: ruta admin requiere superuser");
      return next("/unauthorized");
    }
  }

  next();
});
export default router;
