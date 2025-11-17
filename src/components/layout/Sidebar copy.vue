<template>
  <!-- Sidebar Desktop -->
  <aside
    class="sidebar hidden md:block fixed h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 top-16"
    :class="sidebarClasses">

    <!-- Contenido del Sidebar -->
    <div class="h-full flex flex-col py-4 overflow-y-auto">

      <!-- Menú de Navegación -->
      <nav class="flex-1 space-y-1 px-3">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name" 
          :to="item.path"
          class="flex items-center gap-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
          :class="{
            'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400': $route.path === item.path,
            'justify-center': isCollapsed
          }">
          <i :class="item.icon" class="text-lg shrink-0"></i>
          <span class="font-medium transition-all duration-200 whitespace-nowrap"
            :class="isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'">
            {{ item.name }}
          </span>
        </router-link>
      </nav>

      <!-- Toggle Collapse -->
      <div class="px-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button @click="toggleSidebar"
          class="flex items-center gap-3 p-3 w-full rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="isCollapsed ? 'justify-center' : ''">
          <i class="pi pi-chevron-left text-lg transition-transform duration-300"
            :class="isCollapsed ? 'rotate-180' : ''"></i>
          <span class="font-medium transition-all duration-200 whitespace-nowrap"
            :class="isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'">
            {{ isCollapsed ? 'Expandir' : 'Colapsar' }}
          </span>
        </button>
      </div>
    </div>
  </aside>

  <!-- Sidebar Mobile -->
  <div class="md:hidden">
    <!-- Overlay -->
    <div v-show="mobileOpen" 
         class="fixed inset-0 bg-black transition-opacity duration-300 z-40"
         :class="mobileOpen ? 'opacity-50' : 'opacity-0'" 
         @click="closeMobileSidebar"></div>

    <!-- Sidebar Mobile -->
    <aside
      class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 z-50 overflow-y-auto"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full'">
      <div class="h-full flex flex-col py-4">
        <nav class="flex-1 space-y-1 px-3">
          <router-link 
            v-for="item in menuItems" 
            :key="item.name" 
            :to="item.path" 
            @click="closeMobileSidebar"
            class="flex items-center gap-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :class="{ 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400': $route.path === item.path }">
            <i :class="item.icon" class="text-lg shrink-0"></i>
            <span class="font-medium">{{ item.name }}</span>
          </router-link>
        </nav>

        <!-- Botón cerrar sidebar mobile -->
        <div class="px-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button @click="closeMobileSidebar"
            class="flex items-center gap-3 p-3 w-full rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="pi pi-times text-lg"></i>
            <span class="font-medium">Cerrar</span>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/sidebar/uiStore'

const uiStore = useUIStore()

const isCollapsed = computed(() => uiStore.sidebarCollapsed)
const mobileOpen = computed(() => uiStore.mobileSidebarOpen)

const sidebarClasses = computed(() => {
  return isCollapsed.value ? 'w-20' : 'w-64'
})

const toggleSidebar = () => {
  uiStore.toggleSidebar()
}

const closeMobileSidebar = () => {
  uiStore.closeMobileSidebar()
}

// Items del menú
const menuItems = [
  { name: 'Dashboard', path: '/', icon: 'pi pi-home' },
  { name: 'Usuarios', path: '/users', icon: 'pi pi-users' },
  { name: 'Reportes', path: '/reports', icon: 'pi pi-chart-bar' },
  { name: 'Noticias', path: '/noticias', icon: 'pi pi-newspaper' },
  { name: 'Configuración', path: '/settings', icon: 'pi pi-cog' },
]
</script>

<style scoped>
.sidebar {
  height: calc(100vh - 4rem); /* 4rem = altura del header */
}
</style>