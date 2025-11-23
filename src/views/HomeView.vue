<template>
  <section
    class="relative min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
    <!-- Header acoplado -->
    <HeaderLanding />
    <!-- Contenido principal -->
    <div class="flex flex-1 flex-col md:flex-row">
      <!-- Lado izquierdo: contenido -->
      <div class="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-4 md:py-16 z-10">
        <!-- Badge moderno -->
        <div
          class="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6 mx-auto md:mx-0">
          🚀 Plataforma Next-Gen
        </div>

        <h1
          class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4 md:mb-0 font-arkhip text-center md:text-left">
          (SID) - SUITE  DE INNOVACIÓN
          <span
            class="block md:inline text-transparent bg-clip-text bg-linear-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 font-arkhip animate-pulse bg-size-[200%_auto] hover:animate-none transition-all duration-1000 hover:bg-size-[100%_auto]">
            DIGITAL
          </span>
          <span
            class="block md:inline text-sm md:text-lg lg:text-xl font-normal text-gray-500 dark:text-gray-400 align-middle md:ml-2 lg:ml-4 mt-2 md:mt-0">
            {{ version }}
          </span>
        </h1>

        <!-- Features grid responsive -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 text-center mb-2 md:mb-2">
          <!-- Feature 1 -->
          <div
            class="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
            <h3 class="text-base md:text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Interfaz Intuitiva</h3>
            <p class="text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed">
              Diseño moderno y fácil de usar que requiere mínima capacitación.
            </p>
          </div>

          <!-- Feature 2 -->
          <div
            class="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
            <h3 class="text-base md:text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Integración Total</h3>
            <p class="text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed">
              Todos los módulos conectados para un flujo de trabajo unificado.
            </p>
          </div>

          <!-- Feature 3 -->
          <div
            class="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
            <h3 class="text-base md:text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Acceso Móvil</h3>
            <p class="text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed">
              Disponible desde cualquier dispositivo con conexión a internet.
            </p>
          </div>
        </div>

        <!-- Tecnologías -->
        <div class="mb-4 md:mb-6 my-4 md:my-5 text-center">
          <h3 class="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 md:mb-4">
            Desarrollado con las tecnologías más modernas:
          </h3>
          <!-- DIVIDER -->
          <div class="my-3 md:my-4 mb-3 md:mb-4 border-t border-gray-200 dark:border-gray-700 mx-auto w-24 md:w-32">
          </div>

          <div class="flex flex-wrap justify-center items-center gap-2">
            <div v-for="(tech, index) in technologies" :key="index"
              class="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2.5 py-1 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
              <img :src="tech.icon" :alt="tech.name"
                class="w-4 h-4 object-contain dark:brightness-90 dark:contrast-125 transition-all duration-300" />
              <span class="font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300 text-sm">{{
                tech.name }}</span>
            </div>
          </div>
        </div>

        <!-- Características responsive -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8 mb-4 md:mb-6">
          <!-- Columna izquierda -->
          <div class="flex flex-col gap-3 md:gap-4 w-full md:w-auto">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
              <span class="text-gray-600 dark:text-gray-300 text-sm md:text-base">Arquitectura modular</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
              <span class="text-gray-600 dark:text-gray-300 text-sm md:text-base">Escalabilidad garantizada</span>
            </div>
          </div>

          <!-- Columna derecha -->
          <div class="flex flex-col gap-3 md:gap-4 w-full md:w-auto">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
              <span class="text-gray-600 dark:text-gray-300 text-sm md:text-base">Despliegue continuo</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
              <span class="text-gray-600 dark:text-gray-300 text-sm md:text-base">Seguridad robusta</span>
            </div>
          </div>
        </div>

        <!-- Información de soporte al final -->
        <div class="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
            <div class="flex items-center space-x-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 text-indigo-500" viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span>Soporte: {{ soporte }}</span>
            </div>
            <div class="flex items-center space-x-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 text-green-500" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Sistema en producción</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lado derecho: imagen -->
      <div class="hidden md:block w-1/2 relative">
        <!-- Forma diagonal -->
        <div class="absolute left-0 top-0 h-full w-full bg-white dark:bg-gray-900 clip-diagonal z-10"></div>
        <img src="@/assets/icons/home/hero5.avif" alt="Dashboard moderno" class="h-screen  w-full object-cover" />

        <div
          class="absolute bottom-1/4 right-8 lg:right-16 xl:right-32 bg-white dark:bg-gray-800 rounded-xl p-3 lg:p-4 shadow-2xl z-20 transform -rotate-2">
          <div class="text-xs text-gray-500 dark:text-gray-400">Performance</div>
          <div class="text-base lg:text-lg font-bold text-indigo-600 dark:text-indigo-400">+240%</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import HeaderLanding from '@/components/layout/HeaderLanding.vue'
import { ref, onMounted } from 'vue'
import * as icons from '@/assets/icons'
const version = import.meta.env.VITE_VERSION
const soporte = import.meta.env.VITE_SOPORTE

const hasDarkClass = ref(false)
const localStorageTheme = ref('')

onMounted(() => {
  checkThemeStatus()
})

const checkThemeStatus = () => {
  hasDarkClass.value = document.documentElement.classList.contains('dark')
  localStorageTheme.value = localStorage.getItem('theme') || 'no-set'
}

interface Technology {
  name: string
  icon: any
  description?: string
  category?: 'frontend' | 'backend' | 'database' | 'tool'
}

const technologies = ref<Technology[]>([
  { name: 'Vue.js 3', icon: icons.Vuejs },
  { name: 'TypeScript', icon: icons.TypeScript },
  { name: 'Pinia Store', icon: icons.Pinia },
  { name: 'Django REST API', icon: icons.Django },
  { name: 'Tailwindcss', icon: icons.Tailwindcss },
  { name: 'Vite', icon: icons.Vite },
])

</script>

<style scoped>
.clip-diagonal {
  clip-path: polygon(0 0, 1% 0, 45% 100%, 0% 100%);
  opacity: 1;
}

/* Mejoras para móvil */
@media (max-width: 768px) {
  .font-arkhip {
    font-size: clamp(2rem, 8vw, 3rem);
  }
}
</style>