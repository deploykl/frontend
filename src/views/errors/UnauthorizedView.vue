<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Card Container -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden transform transition-all duration-500 hover:scale-105">
        
        <!-- Header con animación -->
        <div class="bg-linear-to-r from-red-500 to-orange-500 p-8 text-center relative overflow-hidden">
          <!-- Efectos de fondo animados -->
          <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-pulse-slow"></div>
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full animate-ping-slow"></div>
          <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full animate-ping-slow animation-delay-1000"></div>
          
          <!-- Icono animado -->
          <div class="relative">
            <div class="w-20 h-20 mx-auto mb-4 relative">
              <!-- Icono principal -->
              <i class="pi pi-ban text-5xl text-white absolute inset-0 flex items-center justify-center animate-bounce"></i>
              <!-- Círculo de fondo animado -->
              <div class="absolute inset-0 border-4 border-white/30 rounded-full animate-ping"></div>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2 animate-fade-in-down">
              Acceso Denegado
            </h1>
            <p class="text-white/90 text-lg animate-fade-in-up animation-delay-300">
              No tienes permisos para acceder
            </p>
          </div>
        </div>

        <!-- Contenido -->
        <div class="p-8 space-y-6">
          <!-- Mensaje descriptivo -->
          <div class="text-center animate-fade-in-up animation-delay-500">
            <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Lo sentimos, pero no tienes los permisos necesarios para acceder a esta página.
            </p>
          </div>

          <!-- Código de error -->
          <div class="text-center animate-fade-in-up animation-delay-700">
            <div class="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
              <span class="text-sm font-mono text-gray-500 dark:text-gray-400">CÓDIGO:</span>
              <span class="text-lg font-bold text-red-500 dark:text-red-400">401</span>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up animation-delay-900">
           
            
            <router-link 
              to="/dimon/consulta-externa/index"
              class="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-linear-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-gray-700 hover:to-gray-800 active:scale-95"
            >
              <i class="pi pi-home text-lg"></i>
              <span>Ir Plataforma</span>
            </router-link>
          </div>

          <!-- Enlace de contacto -->
          <div class="text-center pt-4 animate-fade-in-up animation-delay-1100">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              ¿Crees que es un error? 
              <a href="mailto:soporte@empresa.com" class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline transition-colors">
                Contactar soporte
              </a>
            </p>
          </div>
        </div>

        <!-- Footer decorativo -->
        <div class="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 text-center">
          <div class="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
            <i class="pi pi-shield"></i>
            <span>Sistema Seguro • {{ new Date().getFullYear() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.1;
  }
}

@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-500 {
  animation-delay: 500ms;
}

.animation-delay-700 {
  animation-delay: 700ms;
}

.animation-delay-900 {
  animation-delay: 900ms;
}

.animation-delay-1000 {
  animation-delay: 1000ms;
}

.animation-delay-1100 {
  animation-delay: 1100ms;
}

/* Efectos de glassmorphism mejorados */
.backdrop-blur-lg {
  backdrop-filter: blur(20px);
}

/* Mejoras de rendimiento para animaciones */
* {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
</style>