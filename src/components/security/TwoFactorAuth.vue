<template>
    <div class="twofa-container w-full max-w-md mx-auto">
        <!-- MODO CONFIGURACIÓN 2FA (Primera vez) -->
        <div v-if="authStore.twoFAMode === 'setup'" class="twofa-setup-section space-y-4 max-h-[80vh] overflow-y-auto">
            <!-- Header compacto -->
            <div class="setup-header text-center">
                <i class="fas fa-shield-alt text-3xl text-gray-700 dark:text-gray-300 mb-2"></i>
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Configurar 2FA
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-xs mt-1">
                    Configurar Google Authenticator
                </p>
            </div>

            <!-- Pasos compactos -->
            <div class="steps-container space-y-3">
                <!-- Paso 1 compacto -->
                <div
                    class="step-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="step-content p-3 flex items-start gap-2">
                        <div
                            class="step-number bg-gray-700 dark:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shrink-0">
                            1
                        </div>
                        <div class="step-info flex-1">
                            <h5 class="step-title font-semibold text-gray-800 dark:text-gray-200 text-xs mb-1">
                                Descarga Google Authenticator
                            </h5>
                            <p class="step-description text-gray-600 dark:text-gray-400 text-xs">
                                Disponible en iOS y Android
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Paso 2 compacto -->
                <div
                    class="step-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="step-content p-3 flex items-start gap-2">
                        <div
                            class="step-number bg-gray-700 dark:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shrink-0">
                            2
                        </div>
                        <div class="step-details flex-1">
                            <h5 class="step-title font-semibold text-gray-800 dark:text-gray-200 text-xs mb-2">
                                Escanear código QR
                            </h5>

                            <!-- QR Code Container compacto -->
                            <div v-if="authStore.qrCode" class="qr-section text-center">
                                <div
                                    class="qr-container bg-white p-2 rounded border border-gray-300 dark:border-gray-600 inline-block">
                                    <img :src="authStore.qrCode" alt="QR Code" class="qr-image max-w-[120px] h-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Paso 3 compacto -->
                <div
                    class="step-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="step-content p-3 flex items-start gap-2">
                        <div
                            class="step-number bg-gray-700 dark:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shrink-0">
                            3
                        </div>
                        <div class="step-details flex-1">
                            <h5 class="step-title font-semibold text-gray-800 dark:text-gray-200 text-xs mb-2">
                                Verificar código
                            </h5>

                            <div class="verification-inputs flex flex-col items-center space-y-2">
                                <input v-model="authStore.twoFASetupToken" type="text" placeholder="000000"
                                    maxlength="6"
                                    class="token-input w-full px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded focus:border-blue-500 focus:outline-none bg-transparent text-gray-800 dark:text-gray-200 font-mono tracking-wider text-base"
                                    @input="authStore.validateSetupToken" />

                                <button @click="handleVerifyAndActivate"
                                    :disabled="!authStore.isSetupTokenValid || authStore.twoFALoading"
                                    class="verify-btn w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded font-semibold transition-colors duration-200 flex items-center justify-center text-sm">
                                    <span v-if="authStore.twoFALoading"
                                        class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                    {{ authStore.twoFALoading ? 'Verificando...' : 'Verificar' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Botón volver compacto -->
            <div class="back-section text-center pt-2">
                <button @click="handleBack"
                    class="back-btn px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors duration-200 inline-flex items-center gap-1 text-sm">
                    <i class="fas fa-arrow-left text-xs"></i>
                    Volver al login
                </button>
            </div>
        </div>

        <!-- MODO VERIFICACIÓN 2FA (Ya configurado) -->
        <div v-else-if="authStore.twoFAMode === 'verify'" class="twofa-verify-section space-y-4">
            <!-- Header compacto -->
            <div class="verify-header text-center">
                <i class="fas fa-shield-alt text-3xl text-gray-700 dark:text-gray-300 mb-2"></i>
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Verificación 2FA
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-xs mt-1">
                    Ingresa el código de Google Authenticator
                </p>
            </div>

            <!-- Card de verificación compacto -->
            <div
                class="verify-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="verify-body p-4">
                    <!-- Input group compacto -->
                    <div class="input-group-2fa relative mb-4">
                        <div
                            class="input-icon-2fa absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <input type="text" v-model="authStore.twoFAToken"
                            class="token-field w-full px-8 py-3 border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none bg-transparent text-gray-800 dark:text-gray-200 font-mono tracking-wider text-center text-base"
                            placeholder=" " maxlength="6" required @input="authStore.validateToken"
                            :class="{ 'border-green-500': authStore.isTokenValid }" />
                        <label
                            class="float-label-2fa absolute left-8 top-3 text-gray-500 dark:text-gray-400 transition-all duration-200 pointer-events-none text-sm">
                            Código de 6 dígitos
                        </label>
                    </div>

                    <!-- Botones de acción compactos -->
                    <div class="action-buttons space-y-2">
                        <button @click="handleVerifyToken" :disabled="!authStore.isTokenValid || authStore.twoFALoading"
                            class="verify-main-btn w-full px-3 py-2 bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded font-semibold transition-colors duration-200 flex items-center justify-center text-sm">
                            <span v-if="authStore.twoFALoading"
                                class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            {{ authStore.twoFALoading ? 'Verificando...' : 'Verificar' }}
                        </button>

                        <button @click="handleBack"
                            class="back-btn-secondary w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors duration-200 flex items-center justify-center gap-1 text-sm">
                            <i class="fas fa-arrow-left text-xs"></i>
                            Volver al login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth/authStore'

// Props
interface Props {
    mode: 'setup' | 'verify'
    userId: string | null
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'verify',
    userId: null
})

// Emits
interface Emits {
    (e: 'success', data: any): void
    (e: 'error', message: string): void
    (e: 'back'): void
}

const emit = defineEmits<Emits>()

// Stores
const authStore = useAuthStore()

// Methods
const handleVerifyAndActivate = async (): Promise<void> => {
    if (!props.userId) {
        emit('error', 'ID de usuario no disponible')
        return
    }

    try {
        const result = await authStore.verifyAndActivate2FA(props.userId)
        emit('success', result)
    } catch (error: any) {
        emit('error', error.message)
    }
}

const handleVerifyToken = async (): Promise<void> => {
    if (!props.userId) {
        emit('error', 'ID de usuario no disponible')
        return
    }

    try {
        const result = await authStore.verifyToken(props.userId)
        emit('success', result)
    } catch (error: any) {
        emit('error', error.message)
    }
}

const handleBack = (): void => {
    authStore.backToLogin()
    emit('back')
}
</script>

<style scoped>
/* Scroll personalizado para el modo setup */
.twofa-setup-section::-webkit-scrollbar {
    width: 4px;
}

.twofa-setup-section::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
}

.twofa-setup-section::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
}

.twofa-setup-section::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

.dark .twofa-setup-section::-webkit-scrollbar-track {
    background: #374151;
}

.dark .twofa-setup-section::-webkit-scrollbar-thumb {
    background: #6b7280;
}

.dark .twofa-setup-section::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

/* Estilos para el float label */
.token-field:focus~.float-label-2fa,
.token-field:not(:placeholder-shown)~.float-label-2fa {
    transform: translateY(-18px) scale(0.8);
    color: #3b82f6;
    background: white;
    left: 28px;
    padding: 0 4px;
}

.dark .token-field:focus~.float-label-2fa,
.dark .token-field:not(:placeholder-shown)~.float-label-2fa {
    background: #1f2937;
}

/* Responsive mejorado */
@media (max-width: 768px) {
    .twofa-container {
        max-width: 100%;
        padding: 0 0.5rem;
    }

    .qr-image {
        max-width: 100px;
    }

    .step-content {
        padding: 0.5rem;
    }

    .verify-body {
        padding: 0.75rem;
    }
}

@media (max-width: 480px) {
    .qr-image {
        max-width: 80px;
    }

    .token-input {
        font-size: 0.875rem;
        padding: 0.5rem 0.75rem;
    }

    .verify-btn,
    .verify-main-btn {
        font-size: 0.75rem;
        padding: 0.5rem 0.75rem;
    }
}

/* Mejoras de transición */
.step-card {
    transition: all 0.2s ease;
}

.step-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.verify-card {
    transition: all 0.2s ease;
}

.verify-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>