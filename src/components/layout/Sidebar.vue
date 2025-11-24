<template>
  <!-- Sidebar Desktop -->
  <aside
    class="sidebar hidden md:block fixed h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-30 top-16"
    :class="sidebarClasses">

    <!-- Toggle Collapse Elegante (Fuera del sidebar) -->
    <button @click="toggleSidebar"
      class="cursor-pointer absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center group"
      :class="{
        'hover:bg-gray-50 dark:hover:bg-gray-700': !isCollapsed,
        'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700': isCollapsed
      }">

      <i :class="[
        'pi text-sm transition-all duration-500',
        isCollapsed ? 'pi-chevron-right text-blue-500' : 'pi-chevron-left text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
      ]"></i>

      <!-- Tooltip elegante -->
      <div
        class="absolute right-full mr-3 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {{ isCollapsed ? 'Expandir' : 'Colapsar' }}
      </div>
    </button>

    <!-- Contenido del Sidebar -->
    <div class="h-full flex flex-col py-4 overflow-y-auto">

      <!-- Menú de Navegación -->
      <nav class="flex-1 space-y-1 px-3">
        <template v-for="item in filteredMenuItems" :key="item.title">
          <!-- Header de sección -->
          <div v-if="item.isHeader"
            class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            :class="isCollapsed ? 'text-center' : ''">
            <span v-if="!isCollapsed">{{ item.title }}</span>
            <div v-else class="w-full h-px bg-gray-300 dark:bg-gray-700 my-1"></div>
          </div>

          <!-- Ítem con submenú -->
          <div v-else-if="item.submenu" class="space-y-1">
            <button @click="toggleSubmenu(item)"
              class="flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 group relative overflow-hidden"
              :class="{
                'justify-center': isCollapsed,
                'bg-linear-to-r from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400 border-l-2 border-blue-500 shadow-sm': isSubmenuActive(item),
                'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50': !isSubmenuActive(item)
              }">

              <!-- Efecto de fondo sutil -->
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              </div>

              <div class="flex items-center gap-3 relative z-10">
                <i :class="[
                  item.icon || 'pi pi-circle',
                  'text-lg transition-transform duration-200 group-hover:scale-110',
                  isSubmenuActive(item) ? 'text-blue-500' : 'text-gray-500'
                ]"></i>
                <span class="font-medium transition-all duration-200 whitespace-nowrap"
                  :class="isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'">
                  {{ item.title }}
                </span>
              </div>

              <i v-if="!isCollapsed" :class="[
                'pi text-xs transition-all duration-300 relative z-10',
                openSubmenus.has(item.title) ? 'pi-chevron-up text-blue-500' : 'pi-chevron-down text-gray-400'
              ]"></i>
            </button>

            <!-- Submenú desplegable con diseño profesional -->
            <transition enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
              leave-active-class="transition-all duration-250 ease-in"
              leave-from-class="transform opacity-100 translate-y-0"
              leave-to-class="transform opacity-0 -translate-y-2">

              <div v-if="openSubmenus.has(item.title) && !isCollapsed"
                class="ml-6 mt-1 space-y-1 overflow-hidden border-l border-gray-200 dark:border-gray-700 pl-3 py-1">

                <router-link v-for="subItem in item.submenu" :key="subItem.path" :to="subItem.path || ''"
                  class="flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group relative overflow-hidden"
                  :class="{
                    'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-xs': $route.path === subItem.path,
                    'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50': $route.path !== subItem.path
                  }">

                  <!-- Línea indicadora para items activos -->
                  <div v-if="$route.path === subItem.path"
                    class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-full">
                  </div>

                  <!-- Icono con efecto -->
                  <i :class="[
                    subItem.icon || 'pi pi-circle-fill',
                    'text-xs transition-all duration-200',
                    {
                      'text-blue-500 scale-125': $route.path === subItem.path,
                      'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300': $route.path !== subItem.path
                    }
                  ]"></i>

                  <!-- Texto del subitem -->
                  <span class="text-sm font-medium transition-all duration-200 truncate flex-1" :class="{
                    'text-blue-600 dark:text-blue-400': $route.path === subItem.path,
                    'group-hover:text-gray-900 dark:group-hover:text-gray-200': $route.path !== subItem.path
                  }">
                    {{ subItem.title }}
                  </span>

                  <!-- Badge sutil para items activos -->
                  <div v-if="$route.path === subItem.path" class="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-80">
                  </div>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Ítem de menú normal -->
          <router-link v-else :to="item.path || ''"
            class="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative overflow-hidden"
            :class="{
              'justify-center': isCollapsed,
              'bg-linear-to-r from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400 border-l-2 border-blue-500 shadow-sm': $route.path === item.path,
              'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50': $route.path !== item.path
            }">

            <!-- Efecto de hover sutil -->
            <div
              class="absolute inset-0 bg-linear-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            </div>

            <!-- Indicador de activo (solo cuando no está colapsado) -->
            <div v-if="$route.path === item.path && !isCollapsed"
              class="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r-full"></div>

            <i :class="[
              item.icon || 'pi pi-circle',
              'text-lg transition-transform duration-200 group-hover:scale-110 relative z-10',
              $route.path === item.path ? 'text-blue-500' : 'text-gray-500'
            ]"></i>

            <span class="font-medium transition-all duration-200 whitespace-nowrap relative z-10"
              :class="isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'">
              {{ item.title }}
            </span>

            <!-- Badge minimalista para items activos cuando está colapsado -->
            <div v-if="$route.path === item.path && isCollapsed"
              class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white dark:border-gray-900">
            </div>
          </router-link>
        </template>
      </nav>

      <!-- Espacio inferior para balance visual (sin el botón de colapsar antiguo) -->
      <div class="px-3 pt-4 border-t border-gray-200 dark:border-gray-800 opacity-0">
        <div class="h-10"></div>
      </div>
    </div>
  </aside>

  <!-- Sidebar Mobile -->
  <div class="md:hidden">
    <!-- Overlay con blur -->
    <div v-show="mobileOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40"
      :class="mobileOpen ? 'opacity-100' : 'opacity-0'" @click="closeMobileSidebar"></div>

    <!-- Sidebar Mobile -->
    <aside
      class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 z-50 overflow-y-auto shadow-xl"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full'">

      <div class="h-full flex flex-col py-6">
        <nav class="flex-1 space-y-2 px-4">
          <template v-for="item in filteredMenuItems" :key="item.title">
            <!-- Header de sección -->
            <div v-if="item.isHeader"
              class="px-3 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
              {{ item.title }}
            </div>

            <!-- Ítem con submenú (mobile) -->
            <div v-else-if="item.submenu" class="space-y-1">
              <button @click="toggleSubmenu(item)"
                class="flex items-center justify-between w-full p-4 rounded-xl transition-all duration-200" :class="{
                  'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500': isSubmenuActive(item),
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50': !isSubmenuActive(item)
                }">

                <div class="flex items-center gap-4">
                  <i :class="[
                    item.icon || 'pi pi-circle',
                    'text-lg'
                  ]"></i>
                  <span class="font-medium">{{ item.title }}</span>
                </div>

                <i :class="[
                  'pi text-sm transition-transform duration-300',
                  openSubmenus.has(item.title) ? 'pi-chevron-up' : 'pi-chevron-down'
                ]"></i>
              </button>

              <!-- Submenú desplegable mobile -->
              <div v-if="openSubmenus.has(item.title)"
                class="ml-8 mt-2 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4">
                <router-link v-for="subItem in item.submenu" :key="subItem.path" :to="subItem.path || ''"
                  @click="closeMobileSidebar"
                  class="flex items-center gap-4 p-3 rounded-lg transition-all duration-200 text-sm" :class="{
                    'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold border-l-2 border-blue-500': $route.path === subItem.path,
                    'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50': $route.path !== subItem.path
                  }">

                  <i :class="[
                    subItem.icon || 'pi pi-circle-fill',
                    'text-xs'
                  ]"></i>
                  <span>{{ subItem.title }}</span>
                </router-link>
              </div>
            </div>

            <!-- Ítem de menú normal (mobile) -->
            <router-link v-else :to="item.path || ''" @click="closeMobileSidebar"
              class="flex items-center gap-4 p-4 rounded-xl transition-all duration-200" :class="{
                'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500': $route.path === item.path,
                'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50': $route.path !== item.path
              }">

              <i :class="[
                item.icon || 'pi pi-circle',
                'text-lg'
              ]"></i>
              <span class="font-medium">{{ item.title }}</span>
            </router-link>
          </template>
        </nav>

        <!-- Botón cerrar sidebar mobile -->
        <div class="px-4 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button @click="closeMobileSidebar"
            class="flex items-center gap-4 p-4 w-full rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
            <i class="pi pi-times text-lg"></i>
            <span class="font-medium">Cerrar Menú</span>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUIStore } from '@/stores/sidebar/uiStore'
import { generateMenuFromRoutes } from '@/components/utils/routeToMenu'
import { hasModuleAccess, getUserModules, isSuperUser } from '@/components/utils/permissions'

const uiStore = useUIStore()
const router = useRouter()
const route = useRoute()

// Estado para submenús abiertos
const openSubmenus = ref(new Set<string>());

const isCollapsed = computed(() => uiStore.sidebarCollapsed)
const mobileOpen = computed(() => uiStore.mobileSidebarOpen)

const sidebarClasses = computed(() => {
  return isCollapsed.value ? 'w-20' : 'w-55'
})

// Obtener módulos del usuario
const userModulos = computed(() => getUserModules())
const isSuperuser = computed(() => isSuperUser())

// Función para verificar acceso
const hasModuleAccessComputed = (moduleNames?: string): boolean => {
  return hasModuleAccess(moduleNames, userModulos.value, isSuperuser.value)
}

// GENERAR MENÚ AUTOMÁTICAMENTE DESDE LAS RUTAS
const allMenuItems = computed(() => {
  return generateMenuFromRoutes(router.getRoutes());
})

// FILTRAR ITEMS POR PERMISOS Y OCULTAR EN SIDEBAR
const filteredMenuItems = computed(() => {
  const result = [];
  let lastHeader: any = null;
  let headerHasVisibleItems = false;

  for (const item of allMenuItems.value) {
    // 🔥 FILTRAR RUTAS QUE DEBEN OCULTARSE EN SIDEBAR
    if (item.meta?.ocultarEnSidebar) {
      continue; // Saltar esta ruta completamente
    }

    if (item.isHeader) {
      lastHeader = item;
      headerHasVisibleItems = false;
    } else {
      const isItemVisible = hasModuleAccessComputed(item.requiredModule);

      if (isItemVisible) {
        if (lastHeader && !headerHasVisibleItems) {
          if (!lastHeader.requiredModule || hasModuleAccessComputed(lastHeader.requiredModule)) {
            result.push(lastHeader);
          }
          headerHasVisibleItems = true;
        }

        // Si tiene submenú, filtrar también los subitems
        if (item.submenu) {
          item.submenu = item.submenu.filter(subItem =>
            hasModuleAccessComputed(subItem.requiredModule) && !subItem.meta?.ocultarEnSidebar
          );
          // Solo agregar si tiene subitems visibles
          if (item.submenu.length > 0) {
            result.push(item);
          }
        } else {
          result.push(item);
        }
      }
    }
  }

  return result;
})

// Función para verificar si un submenú está activo
const isSubmenuActive = (item: any): boolean => {
  if (!item.submenu) return false;
  return item.submenu.some((subItem: any) => route.path === subItem.path);
}

// Función para toggle submenú
const toggleSubmenu = (item: any) => {
  if (openSubmenus.value.has(item.title)) {
    openSubmenus.value.delete(item.title);
  } else {
    openSubmenus.value.add(item.title);
  }
}

const toggleSidebar = () => {
  uiStore.toggleSidebar()
}

const closeMobileSidebar = () => {
  uiStore.closeMobileSidebar()
  // Cerrar todos los submenús al cerrar el sidebar móvil
  openSubmenus.value.clear();
}
</script>

<style scoped>
.sidebar {
  font-size: 0.85rem;
  height: calc(100vh - 4rem);
}

/* Scrollbar personalizado */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .sidebar::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark .sidebar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>