<template>
  <header
    class="header fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md transition-colors duration-300">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

      <!-- Logo y toggle sidebar -->
      <div class="flex items-center gap-4">
        <!-- Toggle Mobile Sidebar (SOLO EN MOBILE) -->
        <button @click="toggleMobileSidebar"
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 md:hidden">
          <i class="pi pi-bars text-lg"></i>
        </button>

        <!-- Logo y nombre clickable -->
        <router-link to="/"
          class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-200">
          <img src="@/assets/img/home/logo.png" alt="Logo" class="h-8 w-8 object-contain" />

          <!-- SID solo en móvil -->
          <span class="text-xl font-bold text-gray-800 dark:text-white md:hidden">
            SID
          </span>
          <!-- Nombre completo solo en desktop -->
          <h1 class="text-xl font-bold text-gray-800 dark:text-white hidden md:block">
            {{ projectName }}
          </h1>
        </router-link>
        <!-- Connection Manager -->
        <ConnectionManager v-slot="connection">
          <div class="connection-indicators flex items-center gap-2">
            <NetworkStatusIndicator :isOnline="connection.isOnline" :isMobile="isMobile"
              :lastNetworkCheck="connection.lastNetworkChange" :isCheckingNetwork="connection.isCheckingNetwork"
              @force-check="connection.checkNetworkConnection" />
            <ApiStatusIndicator :isApiConnected="connection.isApiConnected" :isCheckingApi="connection.isCheckingApi"
              :isMobile="isMobile" :checkApiConnection="connection.checkApiConnection" />
          </div>
        </ConnectionManager>
      </div>

      <!-- Contenedor unificado para DarkModeToggle y Menú de usuario -->
      <div class="flex items-center gap-4">
        <!-- Dark Mode Toggle -->
        <DarkModeToggle />

        <!-- Menú de usuario -->
        <nav class="flex items-center">
          <ul class="flex items-center gap-3">
            <li class="relative">
              <a @click="toggleDropdown"
                class="nav-profile flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                <div
                  class="avatar-container w-8 h-8 bg-linear-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {{ userInitial }}
                </div>
                <span class="user-name text-gray-700 dark:text-gray-200 font-medium hidden sm:block">
                  {{ userName }}
                </span>
                <i class="pi pi-chevron-down text-gray-500 dark:text-gray-400 transition-transform duration-200"
                  :class="dropdownOpen ? 'rotate-180' : ''"></i>
              </a>

              <!-- Dropdown Menu -->
              <div v-show="dropdownOpen"
                class="dropdown-menu absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50">
                <div class="dropdown-header px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <div class="flex items-center gap-3">
                    <div
                      class="avatar-container-lg w-12 h-12 bg-linear-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {{ userInitial }}
                    </div>
                    <div class="user-info flex-1 min-w-0">
                      <div class="user-fullname text-gray-900 dark:text-white font-semibold truncate">
                        {{ userFullName }}
                      </div>
                      <div class="user-email text-gray-500 dark:text-gray-400 text-sm truncate">
                        {{ userEmail }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="dropdown-divider border-t border-gray-100 dark:border-gray-700 my-2"></div>

                <router-link to="/perfil" @click="dropdownOpen = false"
                  class="dropdown-item flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <i class="pi pi-user text-gray-500 dark:text-gray-400"></i>
                  <span>Perfil</span>
                </router-link>

                <router-link to="/change-password" @click="dropdownOpen = false"
                  class="dropdown-item flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <i class="pi pi-key text-gray-500 dark:text-gray-400"></i>
                  <span>Cambiar contraseña</span>
                </router-link>

                <router-link to="/settings" @click="dropdownOpen = false"
                  class="dropdown-item flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <i class="pi pi-cog text-gray-500 dark:text-gray-400"></i>
                  <span>Configuración</span>
                </router-link>

                <div class="dropdown-divider border-t border-gray-100 dark:border-gray-700 my-2"></div>

                <!-- 🔥 CAMBIAR A BOTONES PARA MEJOR COMPORTAMIENTO -->
                <button @click="handleLogout" :disabled="isLoggingOut"
                  class="dropdown-item w-full text-left flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150">
                  <i class="pi" :class="isLoggingOut ? 'pi-spin pi-spinner' : 'pi-sign-out'"></i>
                  <span>{{ isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión' }}</span>
                </button>

                <button @click="handleLogoutAll" :disabled="isLoggingOutAll"
                  class="dropdown-item w-full text-left flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150">
                  <i class="pi" :class="isLoggingOutAll ? 'pi-spin pi-spinner' : 'pi-desktop'"></i>
                  <span>{{ isLoggingOutAll ? 'Cerrando sesiones...' : 'Cerrar en todos los dispositivos' }}</span>
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/sidebar/uiStore'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/auth/authStore'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import ConnectionManager from '@/components/connection/ConnectionManager.vue'
import NetworkStatusIndicator from '@/components/connection/NetworkStatusIndicator.vue'
import ApiStatusIndicator from '@/components/connection/ApiStatusIndicator.vue'

const projectName = import.meta.env.VITE_PROJECT_NAME_EXTEND

const router = useRouter()
const uiStore = useUIStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const dropdownOpen = ref(false)
const isLoggingOut = ref(false)
const isLoggingOutAll = ref(false)

// ✅ AGREGAR ESTA PROPIEDAD FALTANTE
const isMobile = computed(() => {
  return window.innerWidth < 768
})
// Computed properties para datos del usuario
const userInitial = computed(() => {
  const username = userStore.userData?.username || 'U'
  return username.charAt(0).toUpperCase()
})

const userName = computed(() => {
  return userStore.userData?.username || '-'
})

const userFullName = computed(() => {
  return userStore.fullName || '-'
})

const userEmail = computed(() => {
  return userStore.userData?.email || '-'
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const toggleMobileSidebar = () => {
  uiStore.toggleMobileSidebar()
}

// Cerrar dropdown al hacer click fuera
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.nav-profile') && !target.closest('.dropdown-menu')) {
    dropdownOpen.value = false
  }
}

// 🔥 FUNCIONES DE LOGOUT CORREGIDAS
const handleLogout = async () => {
  if (isLoggingOut.value) return

  isLoggingOut.value = true
  dropdownOpen.value = false

  try {
    console.log('🔐 Iniciando logout...')
    await authStore.logout()
    console.log('✅ Logout completado, redirigiendo...')

    // 🔥 REDIRIGIR INMEDIATAMENTE DESPUÉS DEL LOGOUT
    router.push('/')

  } catch (error) {
    console.error('❌ Error en logout:', error)
    // Forzar redirección incluso si hay error
    router.push('/')
  } finally {
    isLoggingOut.value = false
  }
}

const handleLogoutAll = async () => {
  if (isLoggingOutAll.value) return

  if (!confirm('¿Estás seguro de que deseas cerrar TODAS las sesiones activas en todos los dispositivos?\n\nEsta acción cerrará tu sesión actual y todas las demás sesiones activas.')) {
    return
  }

  isLoggingOutAll.value = true
  dropdownOpen.value = false

  try {
    console.log('🔐 Iniciando logout de todos los dispositivos...')
    await authStore.logoutAll()
    console.log('✅ Logout de todos los dispositivos completado, redirigiendo...')

    // 🔥 REDIRIGIR INMEDIATAMENTE DESPUÉS DEL LOGOUT
    router.push('/')

  } catch (error) {
    console.error('❌ Error en logout de todos los dispositivos:', error)
    // Forzar redirección incluso si hay error
    router.push('/')
  } finally {
    isLoggingOutAll.value = false
  }
}

// En HeaderDashboard.vue - modificar el onMounted
onMounted(() => {
  const isAuthenticated = !!localStorage.getItem('auth_token');

  if (isAuthenticated && userStore.fetchUserProfile) {
    console.log('🔄 Cargando perfil de usuario...');
    userStore.fetchUserProfile();
  } else {
    console.log('🔒 Usuario no autenticado, omitiendo carga de perfil');
  }

  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  backdrop-filter: blur(8px);
}

.dropdown-item[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.pi-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.dropdown-menu {
  z-index: 1000;
}

/* 🔥 ESTILOS PARA BOTONES EN DROPDOWN */
button.dropdown-item {
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-family: inherit;
  font-size: inherit;
}

button.dropdown-item:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

button.dropdown-item:hover:not(:disabled) {
  background-color: rgba(239, 68, 68, 0.1);
}
</style>