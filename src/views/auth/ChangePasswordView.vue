<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-linear-to-r from-gray-700 to-gray-800 px-6 py-6 relative overflow-hidden">
          <div class="absolute inset-0 bg-linear-to-br from-white/10 to-transparent"></div>
          <div class="relative">
            <h3 class="text-xl font-bold text-white text-center">Cambiar Contraseña</h3>
          </div>
        </div>

        <!-- Form -->
        <div class="p-6">
          <form @submit.prevent="changePassword" class="space-y-4">
            <!-- Current Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contraseña Actual
              </label>
              <div class="relative">
                <input 
                  :type="showCurrentPassword ? 'text' : 'password'" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.current_password }"
                  v-model="passwords.current_password" 
                  required
                  placeholder="Ingresa tu contraseña actual"
                >
                <button 
                  type="button" 
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  @click="showCurrentPassword = !showCurrentPassword"
                >
                  <i :class="showCurrentPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
                </button>
              </div>
              <div v-if="errors.current_password" class="mt-1 text-sm text-red-600">
                {{ errors.current_password }}
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div class="relative">
                <input 
                  :type="showNewPassword ? 'text' : 'password'" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.new_password }"
                  v-model="passwords.new_password" 
                  required
                  placeholder="Mínimo 8 caracteres"
                >
                <button 
                  type="button" 
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  @click="showNewPassword = !showNewPassword"
                >
                  <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
                </button>
              </div>
              <div class="mt-1 text-xs text-gray-500">
                Mínimo 8 caracteres
              </div>
              <div v-if="errors.new_password" class="mt-1 text-sm text-red-600">
                {{ errors.new_password }}
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div class="relative">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.confirm_password }"
                  v-model="passwords.confirm_password" 
                  required
                  placeholder="Confirma tu nueva contraseña"
                >
                <button 
                  type="button" 
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
                </button>
              </div>
              <div v-if="errors.confirm_password" class="mt-1 text-sm text-red-600">
                {{ errors.confirm_password }}
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-between items-center pt-4 border-t border-gray-200">
              <router-link 
                to="/perfil" 
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <i class="pi pi-arrow-left mr-2"></i>
                Volver
              </router-link>
              <button 
                type="submit" 
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="loading"
              >
                <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
                <i v-else class="pi pi-key mr-2"></i>
                {{ loading ? 'Cambiando...' : 'Cambiar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/components/services/Axios'
import { useToast } from '@/components/utils/useToast'

// Interfaces
interface PasswordForm {
  current_password: string
  new_password: string
  confirm_password: string
}

interface FormErrors {
  current_password: string
  new_password: string
  confirm_password: string
}

// Composables
const router = useRouter()
const toast = useToast() // Usa tu toast personalizado

// Reactive data
const passwords = reactive<PasswordForm>({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const errors = reactive<FormErrors>({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const loading = ref<boolean>(false)
const showCurrentPassword = ref<boolean>(false)
const showNewPassword = ref<boolean>(false)
const showConfirmPassword = ref<boolean>(false)

// Methods
const resetErrors = (): void => {
  errors.current_password = ''
  errors.new_password = ''
  errors.confirm_password = ''
}

const validateForm = (): boolean => {
  resetErrors()
  let isValid = true

  // Current password validation
  if (!passwords.current_password.trim()) {
    errors.current_password = 'La contraseña actual es requerida'
    isValid = false
  }

  // New password validation
  if (passwords.new_password.length < 8) {
    errors.new_password = 'La contraseña debe tener al menos 8 caracteres'
    isValid = false
  }

  // Password match validation
  if (passwords.new_password !== passwords.confirm_password) {
    errors.confirm_password = 'Las contraseñas no coinciden'
    isValid = false
  }

  // Same password validation
  if (passwords.new_password === passwords.current_password) {
    errors.new_password = 'La nueva contraseña no puede ser igual a la actual'
    isValid = false
  }

  return isValid
}

const changePassword = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    await api.post('user/change-password/', {
      current_password: passwords.current_password,
      new_password: passwords.new_password,
      confirm_password: passwords.confirm_password
    })

    // Usa tu toast personalizado
    toast.success('Contraseña cambiada exitosamente')
    
    // Reset form
    passwords.current_password = ''
    passwords.new_password = ''
    passwords.confirm_password = ''
    
    // Remove password change requirement
    localStorage.removeItem('requires_password_change')
    
    // Redirect to profile
    router.push('/dimon/consulta-externa/index')
    
  } catch (err: any) {
    console.error('Error al cambiar contraseña:', err)
    
    // Handle backend errors
    if (err.response?.data) {
      const errorData = err.response.data
      
      // Assign errors to corresponding fields
      for (const [field, messages] of Object.entries(errorData)) {
        const errorKey = field as keyof FormErrors
        if (errors.hasOwnProperty(errorKey)) {
          errors[errorKey] = Array.isArray(messages) ? messages[0] : messages as string
        } else {
          // Show general errors in toast
          toast.error(Array.isArray(messages) ? messages[0] : messages as string)
        }
      }
    } else {
      toast.error('Error al cambiar la contraseña')
    }
  } finally {
    loading.value = false
  }
}
</script>