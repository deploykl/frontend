<template>
  <div id="app" class="min-h-screen flex flex-col">

    <!-- Layout principal -->
    <div class="flex flex-1 pt-16">
      <!-- Sidebar -->
     <!--  <Sidebar />  -->

      <!-- Contenido principal con footer AL FINAL -->
      <main class="flex flex-col flex-1 transition-all duration-300 min-w-0 bg-gray-50 dark:bg-gray-900">
        <!-- Contenido de la página (ocupará el espacio disponible) -->
        <div class="flex-1 p-4 md:p-6">
          <router-view />
        </div>
        
        <!-- Footer SIEMPRE al final -->
      <!--   <Footer />  -->
      </main>
    </div>

    <!-- DarkModeToggle flotante -->
  </div>
</template>

<script setup lang="ts">
import Footer from './components/layout/Footer.vue'
import HeaderDashboard from './components/layout/HeaderDashboard.vue'
import Sidebar from './components/layout/Sidebar.vue'
</script>
