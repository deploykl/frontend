// stores/errors/errorStore.ts
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

type MessageType = 'error' | 'success' | 'warning' | 'info'

export const useErrorStore = defineStore('error', () => {
  const message: Ref<string> = ref('')
  const type: Ref<MessageType> = ref('error')
  const timeout: Ref<number> = ref(4500)
  const timer: Ref<ReturnType<typeof setTimeout> | null> = ref(null)
  
  // Referencia al componente Toast de PrimeVue
  let toastComponent: any = null

  const showMessage = (
    msg: string, 
    msgType: MessageType = 'error', 
    msgTimeout: number = 4500
  ): void => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
    
    message.value = msg
    type.value = msgType
    timeout.value = msgTimeout
    
    // Si tenemos el componente Toast de PrimeVue, usarlo
    if (toastComponent) {
      toastComponent.add({
        severity: msgType,
        summary: getSummary(msgType),
        detail: msg,
        life: msgTimeout
      })
    } else {
      // Fallback: usar el sistema antiguo
      console.warn('Toast component not available, using fallback')
      timer.value = setTimeout(() => {
        message.value = ''
      }, timeout.value)
    }
  }

  const getSummary = (type: MessageType): string => {
    const summaries = {
      error: 'Error',
      success: 'Éxito', 
      warning: 'Advertencia',
      info: 'Información'
    }
    return summaries[type]
  }

  const clearMessage = (): void => {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
    message.value = ''
  }

  return { 
    message, 
    type, 
    timeout,
    showMessage, 
    clearMessage,
  }
})