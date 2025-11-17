<template>
  <div class="mb-6 p-4 bg-white rounded-lg shadow-sm">
    <div class="flex flex-wrap gap-4 items-end">
      <div 
        v-for="filter in filters" 
        :key="filter.key"
        class="flex-1 min-w-[200px]"
      >
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ filter.label }}
        </label>
        
        <!-- Input de texto -->
        <input
          v-if="filter.type === 'text'"
          v-model="filterValues[filter.key]"
          type="text"
          :placeholder="filter.placeholder"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="handleFilterChange"
        >
        
        <!-- Select -->
        <select
          v-else-if="filter.type === 'select'"
          v-model="filterValues[filter.key]"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="handleFilterChange"
        >
          <option value="">Todos</option>
          <option 
            v-for="option in filter.options" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        
        <!-- Rango de fechas -->
        <div v-else-if="filter.type === 'date-range'" class="flex gap-2">
          <input
            v-model="filterValues[filter.key + '_start']"
            type="date"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          >
          <input
            v-model="filterValues[filter.key + '_end']"
            type="date"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          >
        </div>
        
        <!-- Número -->
        <input
          v-else-if="filter.type === 'number'"
          v-model="filterValues[filter.key]"
          type="number"
          :placeholder="filter.placeholder"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="handleFilterChange"
        >
      </div>
      
      <!-- Botón limpiar -->
      <button
        @click="clearFilters"
        class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <i class="fas fa-times mr-2"></i>
        Limpiar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Filter {
  key: string
  label: string
  type: 'text' | 'select' | 'date-range' | 'number'
  placeholder?: string
  options?: { value: any; label: string }[]
}

interface Props {
  filters: Filter[]
}

const props = defineProps<Props>()
const emit = defineEmits(['filter-change'])

const filterValues = ref<Record<string, any>>({})

// Inicializar valores de filtros
watch(() => props.filters, (newFilters) => {
  newFilters.forEach(filter => {
    if (filter.type === 'date-range') {
      if (!filterValues.value[filter.key + '_start']) {
        filterValues.value[filter.key + '_start'] = ''
      }
      if (!filterValues.value[filter.key + '_end']) {
        filterValues.value[filter.key + '_end'] = ''
      }
    } else if (!filterValues.value[filter.key]) {
      filterValues.value[filter.key] = ''
    }
  })
}, { immediate: true })

const handleFilterChange = () => {
  emit('filter-change', { ...filterValues.value })
}

const clearFilters = () => {
  Object.keys(filterValues.value).forEach(key => {
    filterValues.value[key] = ''
  })
  emit('filter-change', { ...filterValues.value })
}
</script>