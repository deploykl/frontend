<template>
  <div
    class="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 p-4 sm:p-6 transition-colors duration-300">
    <!-- Encabezado -->
    <div class="mb-6 sm:mb-8">
      <div class="flex items-center space-x-3 mb-3">
        <div class="p-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
          <i class="pi pi-phone text-blue-600 dark:text-blue-400 text-lg"></i>
        </div>
        <div>
          <h1
            class="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-blue-700 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent">
            Listado de Anexos
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-base sm:text-lg mt-1">Gestión y consulta de números anexos
            telefónicos</p>
        </div>
      </div>
    </div>

    <!-- Tarjeta contenedora -->
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <!-- Header de la tabla -->
      <div
        class="px-4 sm:px-6 py-4 border-b border-gray-200/60 dark:border-gray-700 bg-linear-to-r from-gray-50 to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div class="relative group w-full sm:w-auto">
              <input type="text" placeholder="Buscar ..."
                class="pl-12 pr-4 py-3 w-full sm:w-80 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                v-model="searchTerm">
              <i
                class="pi pi-search text-gray-400 dark:text-gray-400 absolute left-4 top-3.5 transition-colors duration-200 group-hover:text-blue-500"></i>
            </div>
            <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <i class="pi pi-filter"></i>
              <span>{{ filteredAndSortedAnexos.length }} resultados</span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="refreshData"
              class="p-2 text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
              :class="{ 'animate-spin': mainStore.loading }">
              <i class="pi pi-refresh"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="mainStore.loading" class="p-8 sm:p-12">
        <div class="flex flex-col items-center justify-center space-y-4">
          <div class="relative">
            <div class="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div
              class="w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0">
            </div>
          </div>
          <div class="text-center">
            <p class="text-gray-600 dark:text-gray-400 font-medium">Cargando anexos</p>
            <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">Estamos obteniendo la información más reciente</p>
          </div>
        </div>
      </div>

      <!-- Tabla - Versión Mobile como Cards -->
      <div v-else>
        <!-- Vista Mobile (Cards) -->
        <div class="sm:hidden space-y-4 p-4">
          <div v-for="(item, index) in filteredAndSortedAnexos" :key="item.id"
            class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200/60 dark:border-gray-600 transition-all duration-300 hover:shadow-md">
            <!-- Header de la card -->
            <div class="flex items-center space-x-3 mb-4">
              <div class="relative">
                <div
                  class="shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {{ getInitials(item.full_name) }}
                </div>
                <div
                  class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full">
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ item.full_name || '-' }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Usuario</p>
              </div>
            </div>

            <!-- Información en grid -->
            <div class="grid grid-cols-1 gap-2">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Dependencia:</span>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 max-w-[120px] truncate">
                  <i class="pi pi-building mr-1 text-xs"></i>
                  {{ item.dependencia_nombre || '-' }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Área:</span>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 max-w-[120px] truncate">
                  <i class="pi pi-map-marker mr-1 text-xs"></i>
                  {{ item.area_nombre || '-' }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Anexo:</span>
                <div class="flex items-center space-x-1">
                  <span
                    class="font-mono font-bold text-gray-900 dark:text-white text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg border border-gray-300/60 dark:border-gray-600 min-w-[60px] text-center">
                    {{ item.anexo_number || '-' }}
                  </span>
                  <button @click="copyAnexo(item.anexo_number)"
                    class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200">
                    <i class="pi pi-copy text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vista Desktop (Tabla) -->
        <div class="hidden sm:block">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[600px]">
              <thead class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th v-for="column in columns" :key="column.field"
                    class="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer group transition-all duration-200"
                    @click="sortTable(column.field)" :class="{
                      'bg-blue-50 dark:bg-blue-900/20': sortField === column.field,
                      'hover:bg-gray-200/50 dark:hover:bg-gray-600/50': sortField !== column.field
                    }">
                    <div class="flex items-center space-x-2">
                      <span class="whitespace-nowrap">{{ column.header }}</span>
                      <div class="flex flex-col">
                        <i class="pi pi-arrow-up text-xs transition-all duration-200"
                          :class="sortField === column.field && sortDirection === 'asc' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'"></i>
                        <i class="pi pi-arrow-down text-xs -mt-1 transition-all duration-200"
                          :class="sortField === column.field && sortDirection === 'desc' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'"></i>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200/60 dark:divide-gray-700/80">
                <tr v-for="(item, index) in filteredAndSortedAnexos" :key="item.id"
                  class="group hover:bg-linear-to-r hover:from-blue-50/80 hover:to-blue-100/30 dark:hover:from-blue-900/20 dark:hover:to-blue-800/10 transition-all duration-300">
                  <td class="px-4 lg:px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <div class="relative">
                        <div
                          class="shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                          {{ getInitials(item.full_name) }}
                        </div>
                        <div
                          class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full">
                        </div>
                      </div>
                      <div class="min-w-0">
                        <span
                          class="text-sm font-semibold text-gray-900 dark:text-white block truncate max-w-[150px]">{{
                          item.full_name || '-' }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">Usuario</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 lg:px-6 py-4">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 max-w-[180px] truncate">
                      <i class="pi pi-building mr-1.5 text-xs"></i>
                      {{ item.dependencia_nombre || '-' }}
                    </span>
                  </td>
                  <td class="px-4 lg:px-6 py-4">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 max-w-[180px] truncate">
                      <i class="pi pi-map-marker mr-1.5 text-xs"></i>
                      {{ item.area_nombre || '-' }}
                    </span>
                  </td>
                  <td class="px-4 lg:px-6 py-4">
                    <div class="flex items-center space-x-2">
                      <span
                        class="font-mono font-bold text-gray-900 dark:text-white text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-xl border border-gray-300/60 dark:border-gray-600 min-w-20 text-center">
                        {{ item.anexo_number || '-' }}
                      </span>
                      <button @click="copyAnexo(item.anexo_number)"
                        class="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                        <i class="pi pi-copy text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredAndSortedAnexos.length === 0 && !mainStore.loading" class="text-center py-12 sm:py-16">
          <div class="flex flex-col items-center justify-center space-y-5">
            <div
              class="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-3xl flex items-center justify-center shadow-inner">
              <i class="pi pi-search text-gray-400 dark:text-gray-500 text-xl sm:text-2xl"></i>
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">No se encontraron anexos
              </h3>
              <p class="text-gray-500 dark:text-gray-400 max-w-md text-sm sm:text-base">
                {{ searchTerm ? 'No hay resultados que coincidan con tu búsqueda.' : 'No hay anexos disponibles en este momento.' }}
              </p>
            </div>
            <button v-if="searchTerm" @click="searchTerm = ''"
              class="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200">
              Limpiar búsqueda
            </button>
          </div>
        </div>
      </div>

      <!-- Footer con información -->
      <div
        class="px-4 sm:px-6 py-4 border-t border-gray-200/60 dark:border-gray-700 bg-linear-to-r from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-sm">
          <div
            class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600 dark:text-gray-400">
            <span>Mostrando <strong class="text-gray-900 dark:text-white">{{ filteredAndSortedAnexos.length }}</strong>
              de {{ mainStore.anexos.length }} anexos</span>
            <div class="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
            <span class="flex items-center space-x-1">
              <i class="pi pi-wifi"></i>
              <span>Sistema actualizado</span>
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-gray-900 dark:text-white font-semibold">Total:</span>
            <span
              class="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
              {{ mainStore.anexos.length }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '@/stores/general/mainStore'
import { useCustomToast } from '@/components/utils/toast'

const mainStore = useMainStore()
const toast = useCustomToast()
const searchTerm = ref('')
const sortField = ref('anexo_number')
const sortDirection = ref('asc')

// Columnas de la tabla
const columns = ref([
  { field: 'full_name', header: 'CONTACTO' },
  { field: 'dependencia_nombre', header: 'DEPENDENCIA' },
  { field: 'area_nombre', header: 'ÁREA' },
  { field: 'anexo_number', header: 'ANEXO' }
])

// Función para obtener iniciales
const getInitials = (name) => {
  if (!name || name === '-') return '--'
  return name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Función para ordenar tabla
const sortTable = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Función para copiar anexo
const copyAnexo = async (anexoNumber) => {
  try {
    await navigator.clipboard.writeText(anexoNumber.toString())
    toast.showSuccess(`Anexo ${anexoNumber} copiado al portapapeles`)
  } catch (err) {
    toast.showError('Error al copiar el anexo')
  }
}

// Función para refrescar datos
const refreshData = async () => {
  try {
    await mainStore.ListAnexo()
    toast.showSuccess('Datos actualizados correctamente')
  } catch (error) {
    toast.showError('Error al actualizar los datos')
  }
}

// Computed: Filtrar y ordenar anexos
const filteredAndSortedAnexos = computed(() => {
  let filtered = mainStore.anexos

  // Aplicar búsqueda
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.full_name?.toLowerCase().includes(term) ||
      item.dependencia_nombre?.toLowerCase().includes(term) ||
      item.area_nombre?.toLowerCase().includes(term) ||
      item.anexo_number?.toString().includes(term)
    )
  }

  // Aplicar ordenamiento
  filtered = [...filtered].sort((a, b) => {
    let aValue = a[sortField.value]
    let bValue = b[sortField.value]

    // Manejar valores nulos/undefined
    if (!aValue) aValue = ''
    if (!bValue) bValue = ''

    // Ordenamiento numérico para anexo_number
    if (sortField.value === 'anexo_number') {
      aValue = parseInt(aValue) || 0
      bValue = parseInt(bValue) || 0
    }

    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

onMounted(async () => {
  try {
    await mainStore.ListAnexo()
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
</script>

<style scoped>
/* Asegurar que los íconos de PrimeIcons tengan el tamaño correcto */
.pi {
  font-size: inherit;
}
</style>