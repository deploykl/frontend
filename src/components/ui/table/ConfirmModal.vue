<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
      @click="closeModal"
    ></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-2xl">
        <!-- Contenido del modal -->
        <div class="bg-white rounded-2xl shadow-xl transition-all transform">
          <!-- Header -->
          <div class="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editing ? 'Editar' : 'Crear' }} Registro
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitForm" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="field in fields" 
                :key="field.name"
                :class="field.fullWidth ? 'md:col-span-2' : ''"
              >
                <label :for="field.name" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>

                <!-- Input de texto -->
                <input
                  v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'"
                  :id="field.name"
                  v-model="formData[field.name]"
                  :type="field.type"
                  :required="field.required"
                  :placeholder="field.placeholder"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >

                <!-- Textarea -->
                <textarea
                  v-else-if="field.type === 'textarea'"
                  :id="field.name"
                  v-model="formData[field.name]"
                  :required="field.required"
                  :placeholder="field.placeholder"
                  :rows="field.rows || 3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>

                <!-- Select -->
                <select
                  v-else-if="field.type === 'select'"
                  :id="field.name"
                  v-model="formData[field.name]"
                  :required="field.required"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option 
                    v-for="option in field.options" 
                    :key="option.value" 
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>

                <!-- Checkbox -->
                <div v-else-if="field.type === 'checkbox'" class="flex items-center">
                  <input
                    :id="field.name"
                    v-model="formData[field.name]"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <label :for="field.name" class="ml-2 block text-sm text-gray-900">
                    {{ field.placeholder }}
                  </label>
                </div>

                <!-- Date -->
                <input
                  v-else-if="field.type === 'date'"
                  :id="field.name"
                  v-model="formData[field.name]"
                  type="date"
                  :required="field.required"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >

                <!-- Number -->
                <input
                  v-else-if="field.type === 'number'"
                  :id="field.name"
                  v-model="formData[field.name]"
                  type="number"
                  :required="field.required"
                  :placeholder="field.placeholder"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >

                <!-- Error message -->
                <p v-if="errors[field.name]" class="mt-1 text-sm text-red-600">
                  {{ errors[field.name] }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {{ editing ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number'
  required?: boolean
  placeholder?: string
  options?: { value: any; label: string }[]
  fullWidth?: boolean
  rows?: number
}

interface Props {
  show: boolean
  item: any
  editing: boolean
  fields: FormField[]
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [] // Valor por defecto para fields
})

const emit = defineEmits(['close', 'submit'])

const formData = ref<Record<string, any>>({})
const errors = reactive<Record<string, string>>({})

// Inicializar form data - CORREGIDO
watch(() => props.item, (newItem) => {
  if (newItem) {
    formData.value = { ...newItem }
  } else {
    formData.value = {}
    // Verificar que fields exista antes de iterar
    if (props.fields && Array.isArray(props.fields)) {
      props.fields.forEach(field => {
        if (field.type === 'checkbox') {
          formData.value[field.name] = false
        } else if (field.type === 'select') {
          formData.value[field.name] = ''
        } else {
          formData.value[field.name] = ''
        }
      })
    }
  }
}, { immediate: true })

// Cerrar modal con ESC
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal()
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

const closeModal = () => {
  emit('close')
  clearErrors()
}

const submitForm = () => {
  if (validateForm()) {
    emit('submit', {
      data: formData.value,
      isEditing: props.editing
    })
    closeModal()
  }
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  // Verificar que fields exista antes de iterar
  if (props.fields && Array.isArray(props.fields)) {
    props.fields.forEach(field => {
      if (field.required && !formData.value[field.name]) {
        errors[field.name] = `${field.label} es requerido`
        isValid = false
      }
    })
  }

  return isValid
}

const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>