<template>
  <button @click="themeStore.toggleDarkMode"
    class="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-110 cursor-pointer border border-gray-200 dark:border-gray-600"
    :aria-label="themeStore.isDark ? 'Activar modo claro' : 'Activar modo oscuro'">
    
    <!-- Contenedor para la animación -->
    <div class="relative w-6 h-6">
      <!-- Sol con animación de brillo -->
      <svg v-if="!themeStore.isDark"
        class="w-6 h-6 text-yellow-500 transition-all duration-700 ease-in-out transform rotate-0 hover:rotate-45 animate-pulse"
        fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
      </svg>
      
      <!-- Luna con animación de brillo estelar -->
      <svg v-else
        class="w-6 h-6 text-indigo-300 transition-all duration-700 ease-in-out transform rotate-0 hover:rotate-12 animate-pulse"
        fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
        
        <!-- Estrellas decorativas -->
        <circle cx="17" cy="5" r="0.5" fill="white" class="animate-twinkle"/>
        <circle cx="20" cy="8" r="0.3" fill="white" class="animate-twinkle delay-100"/>
        <circle cx="15" cy="3" r="0.4" fill="white" class="animate-twinkle delay-200"/>
      </svg>
      
      <!-- Efecto de brillo circular -->
      <div v-if="!themeStore.isDark" 
        class="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-ping"></div>
    </div>
    
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/sidebar/themeStore'

const themeStore = useThemeStore()
</script>

<style scoped>
/* Animación personalizada para el parpadeo de estrellas */
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}

.delay-100 {
  animation-delay: 0.5s;
}

.delay-200 {
  animation-delay: 1s;
}

/* Asegurar que el cursor sea pointer */
button {
  cursor: pointer !important;
}

/* Efecto de hover más suave */
button:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

button:hover svg {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}
</style>