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
  meta?: { // ← AGREGAR ESTA PROPIEDAD
    ocultarEnSidebar?: boolean;
    [key: string]: any;
  };
}

// ORDEN ESPECÍFICO PARA RUTAS DIMON (grupos e items individuales)
const DIMON_ORDER = [
  "SGD DIMON", // Grupo SGD (que contiene SGD - DIMON1, etc.)
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
  "/general/birthday": { title: "GENERAL", requiredModule: PERMISSIONS.GENERAL },
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
  "GENERAL",
  "Principal",
  "DGOS",
  "DIMON",
  "DIEM",
  "ADMIN",
];

export const generateMenuFromRoutes = (
  routes: RouteRecordRaw[]
): MenuItem[] => {
  const allItems: MenuItem[] = [];
  const addedPaths = new Set<string>();
  const sectionItems = new Map<string, MenuItem>();

  // Función recursiva para procesar rutas
  const processRoute = (route: RouteRecordRaw, parentPath: string = "") => {
    const fullPath =
      parentPath + (route.path.startsWith("/") ? route.path : `/${route.path}`);

    if (route.meta?.public || route.meta?.hideLayout || !route.meta?.title) {
      return;
    }

    // Determinar la sección basada en el path
    let sectionTitle = "GENERAL";
    for (const [pathPrefix, section] of Object.entries(routeSections)) {
      if (section && fullPath.startsWith(pathPrefix)) {
        sectionTitle = section.title;
        break;
      }
    }

    // Guardar la sección si no existe
    if (!sectionItems.has(sectionTitle)) {
      const sectionConfig = Object.values(routeSections).find(
        (s) => s?.title === sectionTitle
      );
      sectionItems.set(sectionTitle, {
        title: sectionTitle,
        isHeader: true,
        requiredModule: sectionConfig?.requiredModule,
      });
    }

    // Crear y agregar el ítem del menú
    if (!addedPaths.has(fullPath)) {
      addedPaths.add(fullPath);

      const menuItem: MenuItem = {
        title: route.meta.title as string,
        icon: getAutoIcon(route.meta.title as string, fullPath),
        path: fullPath,
        requiredModule: route.meta.requiredModule as string,
          meta: { // ← AGREGAR ESTA LÍNEA PARA COPIAR EL META
          ...route.meta
        }
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

  // Agrupar items en submenús CON ORDEN ESPECÍFICO Y AGRUPACIÓN
  const groupedItems: MenuItem[] = [];
  const sectionGroups = new Map<string, MenuItem[]>();

  // Agrupar items por sección
  allItems.forEach((item) => {
    let itemSection = "GENERAL";
    for (const [pathPrefix, sectionConfig] of Object.entries(routeSections)) {
      if (sectionConfig && item.path && item.path.startsWith(pathPrefix)) {
        itemSection = sectionConfig.title;
        break;
      }
    }

    if (!sectionGroups.has(itemSection)) {
      sectionGroups.set(itemSection, []);
    }
    sectionGroups.get(itemSection)!.push(item);
  });

  // Procesar cada sección
  SECTION_ORDER.forEach((sectionTitle) => {
    const section = sectionItems.get(sectionTitle);
    if (section) {
      groupedItems.push(section);

      const sectionItemsList = sectionGroups.get(sectionTitle) || [];

      // 🔥 LÓGICA ESPECIAL PARA SECCIÓN DIMON
      if (sectionTitle === "DIMON") {
        // 1. Primero agrupar items por título base (para mantener submenús)
        const titleGroups = new Map<string, MenuItem[]>();

        sectionItemsList.forEach((item) => {
          // Extraer la parte antes del " - " como grupo
          const baseTitle =
            item.title && item.title.includes(" - ")
              ? item.title.split(" - ")[0]
              : item.title;

          const safeBaseTitle = baseTitle || item.title;

          if (!titleGroups.has(safeBaseTitle)) {
            titleGroups.set(safeBaseTitle, []);
          }
          titleGroups.get(safeBaseTitle)!.push(item);
        });

        // 2. Aplicar orden específico a DIMON
        const orderedDimonItems: MenuItem[] = [];

        DIMON_ORDER.forEach((orderedTitle) => {
          if (titleGroups.has(orderedTitle)) {
            const items = titleGroups.get(orderedTitle)!;

            if (items.length > 1) {
              // Crear submenu para items agrupados
              const firstItemPath = items[0]?.path || "";
              const submenuItem: MenuItem = {
                title: orderedTitle,
                icon: getAutoIcon(orderedTitle, firstItemPath),
                isSubmenu: true,
                isOpen: false,
                submenu: items.map((item) => ({
                  ...item,
                  title:
                    item.title && item.title.includes(" - ")
                      ? item.title.replace(`${orderedTitle} - `, "")
                      : item.title,
                  isSubmenu: false,
                })),
              };
              orderedDimonItems.push(submenuItem);
            } else {
              // Agregar item individual
              orderedDimonItems.push(...items);
            }

            // Eliminar del mapa para no procesarlo de nuevo
            titleGroups.delete(orderedTitle);
          }
        });

        // 3. Agregar cualquier grupo restante que no esté en DIMON_ORDER
        titleGroups.forEach((items, baseTitle) => {
          if (items.length > 1) {
            const firstItemPath = items[0]?.path || "";
            const submenuItem: MenuItem = {
              title: baseTitle,
              icon: getAutoIcon(baseTitle, firstItemPath),
              isSubmenu: true,
              isOpen: false,
              submenu: items.map((item) => ({
                ...item,
                title:
                  item.title && item.title.includes(" - ")
                    ? item.title.replace(`${baseTitle} - `, "")
                    : item.title,
                isSubmenu: false,
              })),
            };
            orderedDimonItems.push(submenuItem);
          } else {
            orderedDimonItems.push(...items);
          }
        });

        groupedItems.push(...orderedDimonItems);
      } else {
        // Lógica original para otras secciones
        const titleGroups = new Map<string, MenuItem[]>();

        sectionItemsList.forEach((item) => {
          const baseTitle =
            item.title && item.title.includes(" - ")
              ? item.title.split(" - ")[0]
              : item.title;

          const safeBaseTitle = baseTitle || item.title;

          if (!titleGroups.has(safeBaseTitle)) {
            titleGroups.set(safeBaseTitle, []);
          }
          titleGroups.get(safeBaseTitle)!.push(item);
        });

        // Crear estructura de menú con submenús
        titleGroups.forEach((items, baseTitle) => {
          if (items.length > 1) {
            const firstItemPath = items[0]?.path || "";
            const submenuItem: MenuItem = {
              title: baseTitle,
              icon: getAutoIcon(baseTitle, firstItemPath),
              isSubmenu: true,
              isOpen: false,
              submenu: items.map((item) => ({
                ...item,
                title:
                  item.title && item.title.includes(" - ")
                    ? item.title.replace(`${baseTitle} - `, "")
                    : item.title,
                isSubmenu: false,
              })),
            };
            groupedItems.push(submenuItem);
          } else {
            groupedItems.push(...items);
          }
        });
      }
    }
  });

  return groupedItems;
};
