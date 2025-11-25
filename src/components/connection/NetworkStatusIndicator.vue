<template>
  <div 
    :class="containerClasses" 
    :title="tooltipText" 
    @click="handleClick" 
    class="group relative"
  >
    <!-- Efecto de pulso para estado online -->
    <div 
      v-if="isOnline && !isCheckingNetwork"
      class="absolute inset-0 rounded-full animate-ping opacity-20"
      :class="pulseColor"
    ></div>

    <!-- Partícula de clic -->
    <div 
      v-if="showClickEffect" 
      class="absolute inset-0 rounded-full bg-current animate-ping"
    ></div>

    <div class="relative flex items-center gap-2 z-10">
      <i :class="iconClass" class="transition-all duration-200"></i>
      <span class="font-medium text-sm hidden sm:block">  <!-- ✅ AGREGADO hidden sm:block -->
        {{ statusText }}
      </span>
      <span 
        v-if="showLastCheck && lastNetworkCheck" 
        class="text-xs opacity-80 ml-1 hidden sm:block"  
      >
        {{ formattedLastCheck }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  isOnline: boolean
  isMobile: boolean
  showLastCheck?: boolean
  lastNetworkCheck: number | null
  isCheckingNetwork: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLastCheck: false
})

const emit = defineEmits<{
  forceCheck: []
}>()

const showClickEffect = ref(false)

// Colores para efectos
const pulseColor = computed(() => props.isOnline ? 'bg-green-400 dark:bg-green-500' : '')

// Clases del contenedor
const containerClasses = computed(() => {
  const base = 'flex items-center cursor-pointer transition-all duration-200 relative overflow-hidden rounded-xl border'
  const mobile = 'p-2 w-9 h-9 justify-center shadow-sm dark:shadow-none'
  const desktop = 'py-2 px-3 text-sm shadow-sm dark:shadow-none'

  if (props.isMobile) {
    if (props.isCheckingNetwork) {
      return `${base} ${mobile} bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700`
    }
    if (props.isOnline) {
      return `${base} ${mobile} bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700`
    }
    return `${base} ${mobile} bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700`
  }

  // Desktop
  if (props.isCheckingNetwork) {
    return `${base} ${desktop} bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700`
  }
  if (props.isOnline) {
    return `${base} ${desktop} bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700`
  }
  return `${base} ${desktop} bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700`
})

// Iconos
const iconClass = computed(() => {
  const base = 'pi text-sm'
  if (props.isCheckingNetwork) return `${base} pi-spinner pi-spin text-yellow-600 dark:text-yellow-400`
  if (props.isOnline) return `${base} pi-wifi text-green-600 dark:text-green-400`
  return `${base} pi-wifi-off text-red-600 dark:text-red-400`
})

// Textos
const statusText = computed(() => {
  if (props.isCheckingNetwork) return 'Verificando...'
  return props.isOnline ? 'Online' : 'Offline'
})

const tooltipText = computed(() => {
  if (props.isCheckingNetwork) return 'Verificando conexión a Internet...'
  return props.isOnline ? 
    'Conexión a Internet estable. Click para verificar' : 
    'Sin conexión a Internet. Click para verificar'
})

const formattedLastCheck = computed(() => {
  if (!props.lastNetworkCheck) return ''
  const now = Date.now()
  const diff = Math.floor((now - props.lastNetworkCheck) / 1000)
  
  if (diff < 60) return `Hace ${diff}s`
  if (diff < 3600) return `Hace ${Math.floor(diff/60)}m`
  return `Hace ${Math.floor(diff/3600)}h`
})

const handleClick = () => {
  showClickEffect.value = true
  setTimeout(() => showClickEffect.value = false, 400)
  emit('forceCheck')
}
</script>