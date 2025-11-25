<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/10 dark:to-indigo-900/20 relative overflow-hidden">
    <!-- Efectos de fondo elegantes -->
    <div class="absolute inset-0">
      <!-- Partículas flotantes -->
      <div class="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-float-1"></div>
      <div class="absolute w-3 h-3 bg-violet-400/30 rounded-full animate-float-2"></div>
      <div class="absolute w-1 h-1 bg-indigo-400/40 rounded-full animate-float-3"></div>
      
      <!-- Ondas sutiles -->
      <div class="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-blue-100/20 to-transparent dark:from-blue-900/10"></div>
    </div>

    <div class="relative z-10 container mx-auto px-4 py-2">
      <!-- Header elegante -->
      <div class="text-center mb-8">
        <div class="relative inline-flex flex-col items-center">

          <!-- Texto principal -->
          <h1 class="text-4xl md:text-5xl font-bold bg-linear-to-r from-slate-800 via-blue-600 to-cyan-600 dark:from-slate-100 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3 tracking-tight">
            Relación de Cumpleaños
          </h1>
          
          <!-- Línea decorativa animada -->
          <div class="relative">
            <div class="w-24 h-0.5 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            <div class="absolute inset-0 w-24 h-0.5 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full animate-ping"></div>
          </div>
          
          <!-- Subtítulo -->
          <p class="mt-4 text-slate-600 dark:text-slate-400 text-lg font-light">
            Celebrando momentos especiales juntos
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Panel izquierdo - Navegación y controles -->
        <div class="space-y-6">
          <!-- Selector de meses elegante -->
          <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center uppercase tracking-wide">Selecciona el Mes</h3>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="month in meses"
                :key="month.value"
                @click="cambiarMes(month.value)"
                class="aspect-square rounded-xl transition-all duration-300 border-2 group hover:scale-105"
                :class="mainStore.currentMonth === month.value 
                  ? 'bg-linear-to-br from-cyan-500 to-blue-600 border-transparent text-white shadow-lg' 
                  : 'bg-white/60 dark:bg-slate-700/60 border-slate-200/40 dark:border-slate-600/40 text-slate-600 dark:text-slate-400 hover:border-cyan-300 dark:hover:border-cyan-500'"
              >
                <div class="flex flex-col items-center justify-center h-full p-1">
                  <span class="font-semibold text-xs group-hover:scale-110 transition-transform">{{ month.name.substring(0, 3) }}</span>
                  <span class="text-xs opacity-80 mt-1">{{ mainStore.cumpleanosPorMes[month.value]?.length || 0 }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Panel de celebración -->
          <div class="bg-linear-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-500/5 backdrop-blur-lg rounded-2xl p-5 border border-cyan-200/30 dark:border-cyan-500/20">
            <div class="text-center space-y-4">
              <!-- Emojis animados -->
              <div class="flex justify-center space-x-3">
                <span class="text-2xl animate-bounce" style="animation-delay: 0s">🎉</span>
                <span class="text-2xl animate-bounce" style="animation-delay: 0.1s">🎂</span>
                <span class="text-2xl animate-bounce" style="animation-delay: 0.2s">🎁</span>
              </div>
              
              <h3 class="text-lg font-semibold bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                ¡Feliz Cumpleaños!
              </h3>
              
              <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Un cálido saludo a nuestros compañeros en su día especial
              </p>

              <!-- Botón toggle elegante -->
              <button 
                @click="toggleCelebration"
                class="w-full py-2.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 group"
                :class="showCelebration 
                  ? 'border-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300' 
                  : 'border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400'"
              >
                <div class="flex items-center justify-center space-x-2">
                  <i class="pi text-sm transition-transform group-hover:scale-110" :class="showCelebration ? 'pi-star-fill' : 'pi-star'"></i>
                  <span class="text-sm font-medium">{{ showCelebration ? 'Celebrando' : 'Activar celebración' }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Panel derecho - Lista de cumpleañeros -->
        <div class="xl:col-span-2">
          <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-hidden">
            <!-- Header del mes con gradiente -->
            <div class="bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-4 relative overflow-hidden">
              <div class="absolute inset-0 bg-linear-to-r from-white/10 to-transparent"></div>
              <h2 class="relative text-xl font-bold text-white text-center drop-shadow-sm">
                {{ nombreMesActual.toUpperCase() }}
              </h2>
            </div>

            <!-- Contenido de la lista -->
            <div class="p-5">
              <!-- Estados -->
              <div v-if="mainStore.loading" class="flex flex-col items-center justify-center py-12">
                <div class="relative">
                  <div class="w-8 h-8 border-3 border-cyan-200 rounded-full"></div>
                  <div class="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p class="mt-3 text-slate-500 dark:text-slate-400 text-sm">Cargando cumpleaños...</p>
              </div>

              <div v-else-if="mainStore.cumpleanosDelMesActual.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i class="pi pi-inbox text-2xl text-slate-400 dark:text-slate-500"></i>
                </div>
                <p class="text-slate-500 dark:text-slate-400 text-sm">No hay cumpleaños este mes</p>
              </div>

              <!-- Grid de cumpleañeros -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div 
                  v-for="persona in mainStore.cumpleanosDelMesActual"
                  :key="persona.id"
                  class="group p-4 rounded-xl border border-slate-200/60 dark:border-slate-600/60 bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-cyan-300/50 dark:hover:border-cyan-500/30 hover:translate-y-[-2px]"
                  :class="persona.dias_para_cumple === 0 && showCelebration ? 'ring-2 ring-amber-400/50 bg-linear-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20' : ''"
                >
                  <div class="flex items-center space-x-4">
                    <!-- Día con efecto neumórfico -->
                    <div class="relative">
                      <div 
                        class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                        :class="persona.dias_para_cumple === 0 && showCelebration 
                          ? 'bg-linear-to-br from-amber-400 to-orange-500 animate-pulse' 
                          : 'bg-linear-to-br from-slate-600 to-slate-700'"
                      >
                        {{ persona.dia_nacimiento }}
                      </div>
                      <!-- Punto indicador para cumpleaños de hoy -->
                      <div v-if="persona.dias_para_cumple === 0 && showCelebration" 
                           class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping"></div>
                    </div>

                    <!-- Información -->
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                        {{ persona.full_name }}
                      </h3>
                      <p class="text-slate-600 dark:text-slate-400 text-xs truncate">
                        {{ persona.dependencia_nombre }}
                        <span v-if="persona.area_nombre"> • {{ persona.area_nombre }}</span>
                      </p>
                    </div>

                    <!-- Badge para hoy -->
                    <div v-if="persona.dias_para_cumple === 0 && showCelebration" class="shrink-0">
                      <span class="px-2.5 py-1 bg-linear-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold rounded-full shadow-sm animate-pulse">
                        HOY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Firma elegante -->
            <div v-if="mainStore.cumpleanosDelMesActual.length > 0" class="px-5 py-4 border-t border-slate-200/40 dark:border-slate-600/40 bg-white/30 dark:bg-slate-800/30">
              <div class="text-center">
                <p class="font-semibold text-slate-900 dark:text-slate-100 text-sm">{{ obtenerDirectorNombre() }}</p>
                <p class="text-slate-600 dark:text-slate-400 text-xs mt-1">{{ obtenerDirectorCargo() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useMainStore } from '@/stores/general/mainStore'

const mainStore = useMainStore()
const showCelebration = ref(true)

const meses = [
  { value: 1, name: 'Ene' }, { value: 2, name: 'Feb' }, { value: 3, name: 'Mar' },
  { value: 4, name: 'Abr' }, { value: 5, name: 'May' }, { value: 6, name: 'Jun' },
  { value: 7, name: 'Jul' }, { value: 8, name: 'Ago' }, { value: 9, name: 'Sep' },
  { value: 10, name: 'Oct' }, { value: 11, name: 'Nov' }, { value: 12, name: 'Dic' }
]

const nombreMesActual = computed(() => {
  return meses.find(m => m.value === mainStore.currentMonth)?.name || ''
})

const obtenerDirectorNombre = () => {
  if (mainStore.cumpleanosDelMesActual.length > 0) {
    return mainStore.cumpleanosDelMesActual[0].director_general_nombre || ''
  }
  return ''
}

const obtenerDirectorCargo = () => {
  if (mainStore.cumpleanosDelMesActual.length > 0) {
    return mainStore.cumpleanosDelMesActual[0].director_general_cargo || ''
  }
  return ''
}

const toggleCelebration = () => {
  showCelebration.value = !showCelebration.value
}

const cambiarMes = async (mes) => {
  mainStore.setCurrentMonth(mes)
  await mainStore.ListCumpleanos(mes)
}

onMounted(async () => {
  try {
    await mainStore.ListCumpleanos()
  } catch (error) {
    console.error('Error loading cumpleaños:', error)
  }
})
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.animate-float-1 {
  animation: float 8s ease-in-out infinite;
  top: 20%; left: 5%;
}

.animate-float-2 {
  animation: float 10s ease-in-out infinite 2s;
  top: 70%; right: 10%;
}

.animate-float-3 {
  animation: float 12s ease-in-out infinite 4s;
  top: 40%; left: 85%;
}

.border-3 {
  border-width: 3px;
}
</style>