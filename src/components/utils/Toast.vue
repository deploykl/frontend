<template>
    <!-- Contenedor de toasts -->
    <div class="toast-container">
        <transition-group name="toast">
            <div v-for="toast in toasts" :key="toast.id" :class="getToastClasses(toast.type)"
                class="toast mb-3 p-4 rounded-lg shadow-lg border-l-4 flex items-center max-w-md relative overflow-hidden">
                <!-- Icono -->
                <i :class="getIconClasses(toast.type)" class="text-xl mr-3"></i>

                <!-- Contenido -->
                <div class="flex-1">
                    <p :class="getTitleClasses(toast.type)" class="font-medium">
                        {{ getTitle(toast.type) }}
                    </p>
                    <p :class="getMessageClasses(toast.type)" class="text-sm">
                        {{ toast.message }}
                    </p>
                </div>

                <!-- Botón cerrar -->
                <button @click="removeToast(toast.id)" class="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <i class="fas fa-times"></i>
                </button>

                <!-- Barra de progreso -->
                <div v-if="toast.duration"
                    class="absolute bottom-0 left-0 h-1 w-full bg-current opacity-25 progress-bar"
                    :style="`animation-duration: ${toast.duration}ms`"></div>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import { ref} from 'vue'

interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'warning' | 'info' | 'update' | 'delete'
    duration?: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

// Función para mostrar toast
const showToast = (message: string, type: Toast['type'] = 'info', duration: number = 5000) => {
    const id = toastId++
    const toast: Toast = {
        id,
        message,
        type,
        duration
    }

    toasts.value.push(toast)

    // Auto-remover si tiene duración
    if (duration > 0) {
        setTimeout(() => {
            removeToast(id)
        }, duration)
    }

    return id
}

// Función para remover toast
const removeToast = (id: number) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index !== -1) {
        toasts.value.splice(index, 1)
    }
}

// Funciones para obtener clases dinámicas
const getToastClasses = (type: Toast['type']) => {
    const baseClasses = {
        success: 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-400',
        error: 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-400',
        warning: 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20 dark:border-yellow-400',
        info: 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400',
        update: 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20 dark:border-indigo-400',
        delete: 'bg-purple-50 border-purple-500 dark:bg-purple-900/20 dark:border-purple-400'
    }
    return baseClasses[type]
}

const getIconClasses = (type: Toast['type']) => {
    const baseClasses = {
        success: 'fas fa-check-circle text-green-500 dark:text-green-400',
        error: 'fas fa-exclamation-circle text-red-500 dark:text-red-400',
        warning: 'fas fa-exclamation-triangle text-yellow-500 dark:text-yellow-400',
        info: 'fas fa-info-circle text-blue-500 dark:text-blue-400',
        update: 'fas fa-sync-alt text-indigo-500 dark:text-indigo-400',
        delete: 'fas fa-trash-alt text-purple-500 dark:text-purple-400'
    }
    return baseClasses[type]
}

const getTitleClasses = (type: Toast['type']) => {
    const baseClasses = {
        success: 'text-green-800 dark:text-green-200',
        error: 'text-red-800 dark:text-red-200',
        warning: 'text-yellow-800 dark:text-yellow-200',
        info: 'text-blue-800 dark:text-blue-200',
        update: 'text-indigo-800 dark:text-indigo-200',
        delete: 'text-purple-800 dark:text-purple-200'
    }
    return baseClasses[type]
}

const getMessageClasses = (type: Toast['type']) => {
    const baseClasses = {
        success: 'text-green-600 dark:text-green-300',
        error: 'text-red-600 dark:text-red-300',
        warning: 'text-yellow-600 dark:text-yellow-300',
        info: 'text-blue-600 dark:text-blue-300',
        update: 'text-indigo-600 dark:text-indigo-300',
        delete: 'text-purple-600 dark:text-purple-300'
    }
    return baseClasses[type]
}

const getTitle = (type: Toast['type']) => {
    const titles = {
        success: 'Éxito',
        error: 'Error',
        warning: 'Advertencia',
        info: 'Información',
        update: 'Actualización',
        delete: 'Eliminación'
    }
    return titles[type]
}

// Exponer funciones al template padre
defineExpose({
    showToast,
    removeToast
})
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
}

.toast-enter-active {
    animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
    animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }

    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.progress-bar {
    animation: progress linear forwards;
}

@keyframes progress {
    from {
        width: 100%;
    }

    to {
        width: 0%;
    }
}
</style>