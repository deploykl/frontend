import type { RouteRecordRaw } from "vue-router";
import { PERMISSIONS } from "@/components/utils/permissions";

interface MenuItem {
  title: string;
  icon?: string;
  path?: string;
  requiredModule?: string;
  isHeader?: boolean;
  isSubmenu?: boolean;
  submenu?: MenuItem[];
  isOpen?: boolean;
  meta?: {
    ocultarEnSidebar?: boolean;
    [key: string]: any;
  };
}

// ORDEN ESPECÍFICO PARA RUTAS DIMON (grupos e items individuales)
const DIMON_ORDER = [
  "Reporte SGD DIMON", // Grupo SGD (que contiene SGD - DIMON1, etc.)
  "Tableros Admin", // Item individual
  "Tableros Monitor", // Item individual
  "SGD", // Grupo SGD (que contiene SGD - DIMON1, etc.)
  "Dashboard Consulta E.", // Grupo SGD (que contiene SGD - DIMON1, etc.)
  "Consulta Externa", // Grupo SGD (que contiene SGD - DIMON1, etc.)
];

// Mapeo AUTOMÁTICO de íconos
const getAutoIcon = (title: string, path: string): string => {
  const lowerTitle = title.toLowerCase();
  const lowerPath = path.toLowerCase();

  if (lowerTitle.includes("dashboard")) return "pi pi-chart-bar";
  if (lowerTitle.includes("tableros admin")) return "pi pi-chart-bar";
  if (lowerTitle.includes("tableros monitor")) return "pi pi-chart-bar";
  if (lowerTitle.includes("sgd")) return "pi pi-table";
  if (lowerTitle.includes("usuario")) return "pi pi-users";
  if (lowerTitle.includes("personal")) return "pi pi-users";
  if (lowerTitle.includes("reporte")) return "pi pi-eye";
  if (lowerTitle.includes("consulta")) return "pi pi-eye";
  if (lowerTitle.includes("anexos")) return "pi pi-phone";
  if (lowerTitle.includes("cumpleaños")) return "pi pi-gift";
  if (lowerTitle.includes("patrimonio")) return "pi pi-building";
  if (lowerTitle.includes("token")) return "pi pi-key";
  if (lowerTitle.includes("incidencia")) return "pi pi-desktop";
  if (lowerTitle.includes("comisión")) return "pi pi-car";
  if (lowerTitle.includes("config")) return "pi pi-cog";
  if (lowerTitle.includes("módulo")) return "pi pi-folder";
  if (lowerTitle.includes("noticias")) return "pi pi-table";

  if (lowerPath.includes("dashboard")) return "pi pi-chart-bar";
  if (lowerPath.includes("personal")) return "pi pi-users";
  if (lowerPath.includes("sgd")) return "pi pi-table";
  if (lowerPath.includes("admin")) return "pi pi-cog";

  return "pi pi-circle";
};

// Mapeo de secciones
const routeSections: Record<
  string,
  { title: string; requiredModule?: string }
> = {
  "/dashboard": { title: "Principal", requiredModule: PERMISSIONS.SUPER_USER },
  "/noticias": { title: "GENERAL", requiredModule: PERMISSIONS.GENERAL },
  "/general/birthday": {
    title: "GENERAL",
    requiredModule: PERMISSIONS.GENERAL,
  },
  "/general/anexos": { title: "GENERAL", requiredModule: PERMISSIONS.GENERAL },
  "/dgos": {
    title: "DGOS",
    requiredModule: `${PERMISSIONS.PERSONAL}, ${PERMISSIONS.PERSONAL_LECTURA}`,
  },
  "/dimon": {
    title: "DIMON",
    requiredModule: `${PERMISSIONS.SISTEMAS}, ${PERMISSIONS.MONITOR}, ${PERMISSIONS.ADMIN_DIMON}`,
  },
  "/diem": {
    title: "DIEM",
    requiredModule: `${PERMISSIONS.UFM}, ${PERMISSIONS.ADMIN_DIEM}`,
  },
  "/admin": { title: "ADMIN", requiredModule: PERMISSIONS.SUPER_USER },
};

// ORDEN FIJO DE SECCIONES
const SECTION_ORDER = [
  "ADMIN",
  "GENERAL",
  "Principal",
  "DGOS",
  "DIMON",
  "DIEM",
];

export const generateMenuFromRoutes = (
  routes: RouteRecordRaw[]
): MenuItem[] => {
  const allItems: MenuItem[] = [];
  const addedPaths = new Set<string>();

  // Función recursiva para procesar rutas
  const processRoute = (route: RouteRecordRaw, parentPath: string = "") => {
    const fullPath =
      parentPath + (route.path.startsWith("/") ? route.path : `/${route.path}`);

    if (route.meta?.public || route.meta?.hideLayout || !route.meta?.title) {
      return;
    }

    // Crear y agregar el ítem del menú
    if (!addedPaths.has(fullPath)) {
      addedPaths.add(fullPath);

      const menuItem: MenuItem = {
        title: route.meta.title as string,
        icon: getAutoIcon(route.meta.title as string, fullPath),
        path: fullPath,
        requiredModule: route.meta.requiredModule as string,
        meta: {
          ...route.meta,
        },
      };

      allItems.push(menuItem);
    }

    // Procesar rutas hijas
    if (route.children) {
      route.children.forEach((child) => processRoute(child, fullPath));
    }
  };

  // Procesar todas las rutas
  routes.forEach((route) => processRoute(route));

  // 🔥 NUEVA LÓGICA SIMPLIFICADA
  const groupedItems: MenuItem[] = [];

  // Crear secciones en orden fijo
  SECTION_ORDER.forEach((sectionTitle) => {
    // Agregar header de sección
    const sectionConfig = Object.values(routeSections).find(
      (s) => s?.title === sectionTitle
    );

    if (sectionConfig) {
      groupedItems.push({
        title: sectionTitle,
        isHeader: true,
        requiredModule: sectionConfig.requiredModule,
      });
    }

    // Filtrar items de esta sección
    const sectionItems = allItems.filter((item) => {
      if (!item.path) return false;

      for (const [pathPrefix, section] of Object.entries(routeSections)) {
        if (
          section?.title === sectionTitle &&
          item.path.startsWith(pathPrefix)
        ) {
          return true;
        }
      }
      return false;
    });

    // 🔥 ORDEN ESPECIAL PARA CADA SECCIÓN
    if (sectionTitle === "DIMON") {
      // Lógica especial para DIMON
      const dimonGroups = new Map<string, MenuItem[]>();

      sectionItems.forEach((item) => {
        const baseTitle = item.title.includes(" - ")
          ? item.title.split(" - ")[0]
          : item.title;

        if (baseTitle && !dimonGroups.has(baseTitle)) {
          dimonGroups.set(baseTitle, []);
        }
        if (baseTitle) {
          dimonGroups.get(baseTitle)!.push(item);
        }
      });

      // Aplicar orden específico de DIMON
      DIMON_ORDER.forEach((orderedTitle) => {
        if (dimonGroups.has(orderedTitle)) {
          const items = dimonGroups.get(orderedTitle)!;
          if (items.length > 1) {
            groupedItems.push({
              title: orderedTitle,
              icon: getAutoIcon(orderedTitle, items[0]?.path || ""),
              isSubmenu: true,
              isOpen: false,
              submenu: items.map((item) => ({
                ...item,
                title: item.title.includes(" - ")
                  ? item.title.replace(`${orderedTitle} - `, "")
                  : item.title,
              })),
            });
          } else {
            groupedItems.push(...items);
          }
          dimonGroups.delete(orderedTitle);
        }
      });

      // Agregar el resto
      dimonGroups.forEach((items, baseTitle) => {
        if (items.length > 1) {
          groupedItems.push({
            title: baseTitle,
            icon: getAutoIcon(baseTitle, items[0]?.path || ""),
            isSubmenu: true,
            isOpen: false,
            submenu: items.map((item) => ({
              ...item,
              title: item.title.includes(" - ")
                ? item.title.replace(`${baseTitle} - `, "")
                : item.title,
            })),
          });
        } else {
          groupedItems.push(...items);
        }
      });
    } else if (sectionTitle === "DGOS") {
      // 🔥 ORDEN ALFABÉTICO SIMPLE PARA DGOS
      const sortedItems = sectionItems.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      groupedItems.push(...sortedItems);
    } else {
      // Orden alfabético para otras secciones
      const sortedItems = sectionItems.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      groupedItems.push(...sortedItems);
    }
  });

  return groupedItems;
};
