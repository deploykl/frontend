<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <!-- Animación principal -->
      <div class="relative">
        <!-- Círculos flotantes decorativos -->
        <div class="absolute -top-20 -left-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute top-20 right-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <!-- Contenido principal -->
        <div class="relative">
          <!-- Número 404 con animación -->
          <div class="mb-8">
            <h1 class="text-9xl font-bold text-gray-900 tracking-tighter animate-bounce">
              4<span class="text-indigo-600 animate-pulse">0</span>4
            </h1>
          </div>
          
          <!-- Icono animado -->
          <div class="mb-8 transform transition-all duration-500 hover:scale-110">
            <div class="w-24 h-24 mx-auto mb-4 relative">
              <div class="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
              <div class="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Texto descriptivo -->
      <div class="space-y-4 transform transition-all duration-300 hover:scale-105">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          ¡Ups! Página no encontrada
        </h2>
        <p class="text-xl text-gray-600">
          La página que buscas parece haberse perdido en el espacio digital.
        </p>
      </div>

      <!-- Acciones -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <router-link 
          to="/"
          class="group relative flex-1 sm:flex-none justify-center py-4 px-8 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <span class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Volver al inicio
          </span>
        </router-link>
        
        <button 
          @click="$router.go(-1)"
          class="group relative flex-1 sm:flex-none justify-center py-4 px-8 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <span class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Regresar
          </span>
        </button>
      </div>

      <!-- Información adicional -->
      <div class="pt-8">
        <p class="text-sm text-gray-500">
          ¿Necesitas ayuda? 
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Contacta con soporte
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No se necesita lógica adicional para esta página
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Mejoras de rendimiento para animaciones */
.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>