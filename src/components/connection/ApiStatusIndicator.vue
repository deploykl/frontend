<template>
  <div :class="containerClasses" :title="tooltipText" @click="handleClick">
    <i :class="iconClass"></i>
    <span v-if="!isMobile" class="font-medium">{{ statusText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isApiConnected: boolean | null
  isCheckingApi: boolean
  isMobile: boolean
  checkApiConnection: () => void
}

const props = defineProps<Props>()

// Clases del contenedor principal
const containerClasses = computed(() => {
  const baseClasses = 'flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out min-w-fit'

  if (props.isMobile) {
    const mobileClasses = 'p-1 w-8 h-8 justify-center rounded-full'
    if (props.isCheckingApi) return `${baseClasses} ${mobileClasses} bg-yellow-50 text-yellow-600 border border-yellow-600`
    if (props.isApiConnected === true) return `${baseClasses} ${mobileClasses} bg-green-50 text-green-600 border border-green-600`
    return `${baseClasses} ${mobileClasses} bg-red-50 text-red-600 border border-red-600`
  }

  const desktopClasses = 'py-1.5 px-3 rounded-full text-sm'
  if (props.isCheckingApi) return `${baseClasses} ${desktopClasses} bg-yellow-50 text-yellow-600 border border-yellow-600`
  if (props.isApiConnected === true) return `${baseClasses} ${desktopClasses} bg-green-50 text-green-600 border border-green-600`
  return `${baseClasses} ${desktopClasses} bg-red-50 text-red-600 border border-red-600`
})

// Iconos dinámicos según estado
const iconClass = computed(() => {
  if (props.isCheckingApi) return 'pi pi-spinner pi-spin'
  if (props.isApiConnected === true) return 'pi pi-database'
  return 'pi pi-cloud'
})

// Texto visible del estado
const statusText = computed(() => {
  if (props.isCheckingApi) return 'Verificando API...'
  if (props.isApiConnected === true) return 'API Conectado'
  if (props.isApiConnected === false) return 'API Desconectado'
  return 'Estado desconocido'
})

// Tooltip dinámico
const tooltipText = computed(() => {
  if (props.isCheckingApi) return 'Verificando conexión con el servidor...'
  if (props.isApiConnected === true) return 'Conexión estable con el servidor'
  if (props.isApiConnected === false) return 'Problemas de conexión con el servidor'
  return 'Estado de conexión desconocido'
})

const handleClick = () => {
  props.checkApiConnection()
}
</script>

<style scoped>
.pi-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>