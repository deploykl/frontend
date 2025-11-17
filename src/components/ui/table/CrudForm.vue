<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
      @click="$emit('cancel')"
    ></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-md">
        <!-- Contenido del modal -->
        <div class="bg-white rounded-2xl shadow-xl transform transition-all">
          <!-- Icono -->
          <div class="flex items-center justify-center w-12 h-12 mx-auto mt-6 bg-red-100 rounded-full">
            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>

          <!-- Contenido -->
          <div class="mt-4 text-center p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ title }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ message }}
            </p>
          </div>

          <!-- Acciones -->
          <div class="mt-6 flex gap-3 justify-center p-6 border-t border-gray-200">
            <button
              type="button"
              @click="$emit('cancel')"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="$emit('confirm')"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  show: boolean
  title: string
  message: string
}

const props = defineProps<Props>()
const emit = defineEmits(['confirm', 'cancel'])

// Cerrar modal con ESC
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('cancel')
  }
}

watch(() => props.show, (show) => {
  if (show) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})
</script>