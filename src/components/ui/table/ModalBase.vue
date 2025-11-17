<template>
  <div v-if="internalVisible" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="handleClose"
    ></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full" :class="widthClass">
        <!-- Contenido del modal -->
        <div class="bg-white rounded-lg shadow-xl transform transition-all">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ dynamicTitle }}
            </h3>
            <button
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              :disabled="loading"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6" :style="{ maxHeight: maxHeight, overflowY: 'auto' }">
            <slot name="content"></slot>
          </div>

          <!-- Footer -->
          <div v-if="!hideFooter" class="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <slot name="footer">
              <!-- Botones por defecto -->
              <button
                @click="handleClose"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                @click="handleConfirm"
                :disabled="loading"
                :class="[
                  'px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50',
                  confirmButtonClass
                ]"
              >
                <span v-if="loading" class="flex items-center gap-2">
                  <i class="fas fa-spinner fa-spin"></i>
                  Procesando...
                </span>
                <span v-else>
                  {{ confirmText }}
                </span>
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  visible: Boolean,
  title: String,
  mode: {
    type: String,
    default: 'create',
    validator: value => ['create', 'edit', 'delete', 'view', 'custom'].includes(value)
  },
  entityName: {
    type: String,
    default: 'registro'
  },
  width: {
    type: String,
    default: '45vw'
  },
  maxHeight: {
    type: String,
    default: '70vh'
  },
  contentPadding: {
    type: String,
    default: '1rem'
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  confirmClass: {
    type: String,
    default: ''
  },
  loading: Boolean,
  hideFooter: Boolean
});

const emit = defineEmits(['update:visible', 'close', 'confirm']);

const internalVisible = ref(props.visible);

// Computed para el ancho del modal
const widthClass = computed(() => {
  const widthMap = {
    '45vw': 'max-w-2xl',
    '50vw': 'max-w-3xl',
    '60vw': 'max-w-4xl',
    '70vw': 'max-w-5xl',
    '80vw': 'max-w-6xl',
    '90vw': 'max-w-7xl',
    '95vw': 'max-w-[95vw]'
  };
  return widthMap[props.width] || 'max-w-2xl';
});

// Computed para el título dinámico
const dynamicTitle = computed(() => {
  const titles = {
    create: `Crear ${props.entityName}`,
    edit: `Editar ${props.entityName}`,
    delete: `Eliminar ${props.entityName}`,
    view: `Detalles de ${props.entityName}`
  };

  return props.title || titles[props.mode] || props.entityName;
});

// Computed para la clase del botón de confirmar
const confirmButtonClass = computed(() => {
  const baseClass = 'bg-blue-600 hover:bg-blue-700';
  const modeClasses = {
    create: 'bg-green-600 hover:bg-green-700',
    edit: 'bg-blue-600 hover:bg-blue-700',
    delete: 'bg-red-600 hover:bg-red-700',
    view: 'bg-gray-600 hover:bg-gray-700'
  };
  
  return modeClasses[props.mode] || baseClass;
});

// Watchers
watch(() => props.visible, (newVal) => {
  internalVisible.value = newVal;
});

watch(internalVisible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Métodos
const handleConfirm = () => {
  emit('confirm');
};

const handleClose = () => {
  internalVisible.value = false;
  emit('update:visible', false);
  emit('close');
};

// Cerrar con ESC
const handleKeydown = (e) => {
  if (e.key === 'Escape' && internalVisible.value) {
    handleClose();
  }
};

// Agregar event listener para ESC
watch(internalVisible, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});
</script>

<style scoped>
/* Transiciones suaves */
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