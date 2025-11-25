<template>
  <div :class="containerClasses" :title="tooltipText" @click="handleClick" class="group relative">
    <!-- Efecto de pulso para estado activo -->
    <div v-if="isApiConnected === true && !isCheckingApi"
      class="absolute inset-0 rounded-full animate-ping opacity-20"
      :class="pulseColor"></div>

    <!-- Partícula de clic -->
    <div v-if="showClickEffect" class="absolute inset-0 rounded-full bg-current animate-ping"></div>

    <div class="relative flex items-center gap-2 z-10">
      <i :class="iconClass" class="transition-all duration-200"></i>
      <span class="font-medium text-sm hidden sm:block">  
        {{ statusText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  isApiConnected: boolean | null
  isCheckingApi: boolean
  isMobile: boolean
  checkApiConnection: () => void
}

const props = defineProps<Props>()
const showClickEffect = ref(false)

// Colores para efectos
const pulseColor = computed(() => props.isApiConnected === true ? 'bg-green-400 dark:bg-green-500' : '')

// Clases del contenedor
const containerClasses = computed(() => {
  const base = 'flex items-center cursor-pointer transition-all duration-200 relative overflow-hidden rounded-xl border'
  const mobile = 'p-2 w-9 h-9 justify-center shadow-sm dark:shadow-none'
  const desktop = 'py-2 px-3 text-sm shadow-sm dark:shadow-none'

  if (props.isMobile) {
    if (props.isCheckingApi) {
      return `${base} ${mobile} bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700`
    }
    if (props.isApiConnected === true) {
      return `${base} ${mobile} bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700`
    }
    return `${base} ${mobile} bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700`
  }

  // Desktop
  if (props.isCheckingApi) {
    return `${base} ${desktop} bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700`
  }
  if (props.isApiConnected === true) {
    return `${base} ${desktop} bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700`
  }
  return `${base} ${desktop} bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700`
})

// Iconos
const iconClass = computed(() => {
  const base = 'pi text-sm'
  if (props.isCheckingApi) return `${base} pi-spinner pi-spin text-yellow-600 dark:text-yellow-400`
  if (props.isApiConnected === true) return `${base} pi-database text-green-600 dark:text-green-400`
  return `${base} pi-cloud text-red-600 dark:text-red-400`
})

// Textos
const statusText = computed(() => {
  if (props.isCheckingApi) return 'Verificando...'
  if (props.isApiConnected === true) return 'Conectado'
  return 'Desconectado'
})

const tooltipText = computed(() => {
  if (props.isCheckingApi) return 'Verificando conexión con el servidor...'
  if (props.isApiConnected === true) return 'Conexión estable con el servidor'
  return 'Problemas de conexión con el servidor'
})

const handleClick = () => {
  showClickEffect.value = true
  setTimeout(() => showClickEffect.value = false, 400)
  props.checkApiConnection()
}
</script>