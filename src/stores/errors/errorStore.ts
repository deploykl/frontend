// stores/errors/errorStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const toastComponent = ref<any>(null)

  const setToastComponent = (component: any) => {
    toastComponent.value = component
  }

  const showMessage = (msg: string, type: string = "info", timeout = 5000) => {
    if (toastComponent.value && toastComponent.value.showToast) {
      toastComponent.value.showToast(msg, type, timeout)
    } else {
      console.log('Toast component not available:', msg, type)
      // Fallback: mostrar en consola si el toast no está disponible
      console.log(`[${type.toUpperCase()}] ${msg}`)
    }
  }

  return {
    setToastComponent,
    showMessage,
  }
})