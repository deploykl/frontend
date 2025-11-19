// composables/useToast.ts
import { ref } from 'vue'

export interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'warning' | 'info' | 'update' | 'delete'
    duration?: number
}

// Estado global del toast
const toasts = ref<Toast[]>([])
let toastId = 0

export const useToast = () => {
    // Función para mostrar toast
    const showToast = (message: string, type: Toast['type'] = 'info', duration: number = 5000): number => {
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
    const removeToast = (id: number): void => {
        const index = toasts.value.findIndex(toast => toast.id === id)
        if (index !== -1) {
            toasts.value.splice(index, 1)
        }
    }

    // Funciones de conveniencia para cada tipo
    const success = (message: string, duration?: number): number => {
        return showToast(message, 'success', duration)
    }

    const error = (message: string, duration?: number): number => {
        return showToast(message, 'error', duration)
    }

    const warning = (message: string, duration?: number): number => {
        return showToast(message, 'warning', duration)
    }

    const info = (message: string, duration?: number): number => {
        return showToast(message, 'info', duration)
    }

    const update = (message: string, duration?: number): number => {
        return showToast(message, 'update', duration)
    }

    const deleteToast = (message: string, duration?: number): number => {
        return showToast(message, 'delete', duration)
    }

    return {
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
        update,
        delete: deleteToast
    }
}