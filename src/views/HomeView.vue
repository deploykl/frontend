<template>
  <section class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
    <!-- Header simple -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <img src="@/assets/img/home/logo.png" alt="Logo" class="h-8 w-8 object-contain" />
          <h1 class="text-xl font-bold text-gray-800 dark:text-white">
            {{ projectName }}
          </h1>
        </div>
        
        <!-- Dark Mode Toggle -->
        <DarkModeToggle />
      </div>
    </header>

    <!-- Contenido principal -->
    <div class="pt-16 min-h-screen flex items-center justify-center">
      <div class="max-w-4xl mx-auto px-6 py-12 text-center">
        
        <!-- Badge de estado -->
        <div class="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium mb-8">
          🔧 Herramientas Automatizadas en Proceso
        </div>

        <!-- Título principal -->
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          PLATAFORMA DE
          <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 block mt-2">
            CONSULTA EXTERNA
          </span>
        </h1>

        <!-- Descripción -->
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Innovación digital para la optimización de procesos y toma de decisiones estratégicas
        </p>

        <!-- Módulo de Consulta Externa -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
         

          <!-- Botón de acceso -->
          <router-link 
            to="/dimon/consulta-externa/login"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <i class="pi pi-sign-in text-lg"></i>
            <span>Acceder al Sistema</span>
          </router-link>

          <!-- Mensaje de desarrollo -->
          <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <i class="pi pi-info-circle text-yellow-500"></i>
              <span>Realizándose pruebas e innovación para la toma de decisiones</span>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <i class="pi pi-shield-check text-green-500"></i>
              <span>Sistema seguro y confiable</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-clock text-blue-500"></i>
              <span>Disponible 24/7</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-verified text-purple-500"></i>
              <span>Versión {{ version }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import DarkModeToggle from '@/components/DarkModeToggle.vue'

const version = import.meta.env.VITE_VERSION || '1.0.0'
const projectName = import.meta.env.VITE_PROJECT_NAME || 'Sistema'

// Estado simple para el tema
</script>

<style scoped>
/* Estilos mínimos necesarios */
.router-link-active {
  text-decoration: none;
}

/* Transiciones suaves */
* {
  transition: all 0.3s ease;
}
</style>