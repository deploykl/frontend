<template>
  <div id="app" class="min-h-screen flex flex-col">
    <HeaderDashboard v-if="!$route.meta.ocultarMenuDash" />

    <!-- Layout principal con sidebar y contenido -->
    <div v-if="!$route.meta.ocultarMenuDash" class="flex flex-1 pt-16">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Contenido principal -->
      <main class="flex-1 transition-all duration-300 min-w-0 bg-gray-50 dark:bg-gray-900 overflow-auto "
        :class="sidebarCollapsed ? 'md:ml-20' : 'md:ml-55'">
        <div class="p-6">
          <router-view />
        </div>
        <OnlineStatus v-if="isAuthenticated" />
        <!-- Footer -->
        <Footer />
      </main>
    </div>

    <!-- Para rutas sin dashboard -->
    <main v-else class="flex-1">
      <router-view />
    </main>
    <GlobalMusicPlayer />

    <!-- Componente Toast global -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useUIStore } from '@/stores/sidebar/uiStore'
import { useThemeStore } from '@/stores/sidebar/themeStore'
import { useErrorStore } from '@/stores/errors/errorStore'
import GlobalMusicPlayer from '@/components/widgets/GlobalMusicPlayer.vue'

import Footer from './components/layout/Footer.vue'
import HeaderDashboard from './components/layout/HeaderDashboard.vue'
import Sidebar from './components/layout/Sidebar.vue'
import Toast from '@/components/utils/Toast.vue' // Ajusta la ruta según tu estructura
import OnlineStatus from '@/components/ui/status/OnlineStatus.vue' // Ajusta la ruta según tu estructura

const uiStore = useUIStore()
const themeStore = useThemeStore()
const errorStore = useErrorStore()

// ✅ Computed para verificar autenticación
const isAuthenticated = computed(() => {
  return !!localStorage.getItem("auth_token")
})
const sidebarCollapsed = computed(() => uiStore.sidebarCollapsed)
const toastRef = ref()

// Inicializar el theme cuando se monta la app
onMounted(() => {
  themeStore.initializeTheme()

  // Conectar el store con el componente Toast
  if (toastRef.value) {
    errorStore.setToastComponent(toastRef.value)
  }
})
</script>
<style scoped></style>