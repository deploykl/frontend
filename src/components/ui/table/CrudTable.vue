<template>
  <div class="overflow-hidden">
    <!-- Loading -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Cargando...</p>
    </div>

    <!-- Tabla -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th 
              v-for="column in config.columns" 
              :key="column.key"
              :class="['px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', column.width]"
            >
              <div class="flex items-center gap-2">
                <span>{{ column.label }}</span>
                <button
                  v-if="column.sortable"
                  @click="$emit('sort', column.key)"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <i class="fas fa-sort"></i>
                </button>
              </div>
            </th>
            <th v-if="config.actions && config.actions.length > 0" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="(item, index) in paginatedData" 
            :key="index"
            class="hover:bg-gray-50 transition-colors"
          >
            <td 
              v-for="column in config.columns" 
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <!-- Slot personalizado para la columna -->
              <slot 
                v-if="$slots[`column-${column.key}`]" 
                :name="`column-${column.key}`" 
                :item="item" 
                :value="item[column.key]"
              ></slot>
              
              <!-- Renderizado por tipo -->
              <template v-else>
                <span v-if="column.type === 'text'">
                  {{ column.formatter ? column.formatter(item[column.key]) : item[column.key] }}
                </span>
                
                <span v-else-if="column.type === 'number'" class="font-mono">
                  {{ column.formatter ? column.formatter(item[column.key]) : item[column.key] }}
                </span>
                
                <span v-else-if="column.type === 'date'" class="text-gray-600">
                  {{ formatDate(item[column.key]) }}
                </span>
                
                <span 
                  v-else-if="column.type === 'badge'" 
                  :class="getBadgeClasses(item[column.key])"
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ column.formatter ? column.formatter(item[column.key]) : item[column.key] }}
                </span>
                
                <span v-else>
                  {{ item[column.key] }}
                </span>
              </template>
            </td>
            
            <!-- Acciones -->
            <td v-if="config.actions && config.actions.length > 0" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-1">
                <button
                  v-for="action in config.actions"
                  :key="action.name"
                  v-show="!action.condition || action.condition(item)"
                  @click="$emit('action', action.name, item)"
                  :class="[action.color, 'p-2 rounded-md transition-colors hover:scale-110']"
                  :title="action.name"
                >
                  <i :class="action.icon" class="text-sm"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="data.length === 0" class="text-center py-12">
        <i class="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
        <p class="text-gray-500 text-lg">No se encontraron registros</p>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="data.length > 0 && itemsPerPage > 0" class="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
      <!-- Información de registros -->
      <div class="text-sm text-gray-700 mb-4 sm:mb-0">
        Mostrando 
        <span class="font-medium">{{ startIndex + 1 }}</span> 
        a 
        <span class="font-medium">{{ endIndex }}</span> 
        de 
        <span class="font-medium">{{ data.length }}</span> 
        resultados
      </div>

      <!-- Selector de items por página -->
      <div class="flex items-center space-x-2 mb-4 sm:mb-0">
        <span class="text-sm text-gray-700">Mostrar:</span>
        <select 
          v-model="itemsPerPage" 
          class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="text-sm text-gray-700">por página</span>
      </div>

      <!-- Navegación de páginas -->
      <div class="flex items-center space-x-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Anterior
        </button>
        
        <div class="flex space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 text-sm border rounded-md transition-colors',
              currentPage === page 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CrudConfig } from './crud.types'

interface Props {
  config: CrudConfig
  data: any[]
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['action', 'sort'])

// Estado de paginación
const currentPage = ref(1)
const itemsPerPage = ref(50) // Por defecto 50

// Computed properties para paginación
const totalPages = computed(() => {
  return Math.ceil(props.data.length / itemsPerPage.value)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return props.data.slice(start, end)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage.value
  return end > props.data.length ? props.data.length : end
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)
  
  // Ajustar si estamos cerca del final
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

// Métodos de paginación
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

// Resetear a página 1 cuando cambian los datos o items por página
watch(() => props.data, () => {
  currentPage.value = 1
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Funciones existentes
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-ES')
}

const getBadgeClasses = (value: any) => {
  const status = String(value).toLowerCase()
  switch (status) {
    case 'active':
    case 'activo':
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'inactive':
    case 'inactivo':
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'pending':
    case 'pendiente':
      return 'bg-blue-100 text-blue-800'
    case 'rejected':
    case 'rechazado':
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>