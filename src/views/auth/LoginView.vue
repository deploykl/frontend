<template>
    <div class="fixed inset-0 overflow-hidden bg-gray-100 dark:bg-gray-950">
        <!-- Fondo GIF -->
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-20"
            :style="{ backgroundImage: `url('/src/assets/gif/city2.gif')` }"></div>

        <div class="flex items-center justify-center min-h-screen relative z-10">
            <div class="w-full max-w-md px-5">
                <!-- Contenedor principal del CARD -->
                <div
                    class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-black/40 p-10 animate-fade-in">

                    <!-- Botón de regreso -->
                    <button @click="handleBackToHome"
                        class="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer">
                        <i class="pi pi-home text-gray-700 dark:text-gray-300 text-xl"></i>
                    </button>

                    <!-- Logo y título - SOLO SE MUESTRA EN LOGIN NORMAL -->
                    <div v-if="!authStore.show2FA" class="text-center mb-8">
                        <div class="flex justify-center mb-4">
                            <img src="@/assets/img/account/user-account.png"
                                class="h-25 w-64 object-contain filter drop-shadow-md" />
                        </div>
                        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                            Panel de Control
                        </h1>
                        <h2 class="text-sm text-gray-600 dark:text-gray-400">Autenticación requerida</h2>
                    </div>

                    <!-- 2FA - CUANDO SE MUESTRA 2FA, OCULTAMOS EL HEADER ANTERIOR -->
                    <TwoFactorAuth v-if="authStore.show2FA" :mode="authStore.twoFAMode"
                        :userId="authStore.pendingUserId" @success="handle2FASuccess" @error="handle2FAError"
                        @back="authStore.backToLogin" />

                    <!-- Login Normal -->
                    <div v-else>
                        <!-- Intentos restantes -->
                        <div v-if="authStore.remainingAttempts !== null && authStore.remainingAttempts > 0"
                            class="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 mb-6">
                            <div class="flex items-center justify-center space-x-3">
                                <i class="fas fa-exclamation-triangle text-yellow-600 dark:text-yellow-300 text-xl"></i>
                                <span class="text-sm text-gray-700 dark:text-gray-300">Intentos restantes:</span>
                                <span
                                    class="bg-yellow-600 dark:bg-yellow-300 text-yellow-100 dark:text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                                    {{ authStore.remainingAttempts }}
                                </span>
                            </div>
                        </div>

                        <!-- Cuenta bloqueada -->
                        <div v-if="authStore.blockedTimeRemaining > 0"
                            class="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-xl p-4 mb-6 animate-pulse">
                            <div class="flex items-center space-x-3 mb-3">
                                <i class="fas fa-lock text-red-600 dark:text-red-300 text-xl"></i>
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        Cuenta bloqueada temporalmente
                                    </p>
                                    <div class="flex items-center justify-between mt-2">
                                        <span class="text-xs text-red-700 dark:text-red-300">
                                            Tiempo restante: {{ authStore.formatTime(authStore.blockedTimeRemaining) }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Barra de progreso -->
                            <div class="w-full bg-red-200 dark:bg-red-700 rounded-full h-2 mt-2">
                                <div class="bg-red-600 dark:bg-red-400 h-2 rounded-full transition-all duration-1000"
                                    :style="{ width: authStore.progressPercentage + '%' }">
                                </div>
                            </div>

                            <!-- Botón para usar otra cuenta -->
                            <div class="mt-4 pt-3 border-t border-red-200 dark:border-red-600">
                                <button @click="authStore.useAnotherAccount"
                                    class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-800/30 rounded-lg transition-colors">
                                    <i class="fas fa-user-plus"></i>
                                    Ingresar con otra cuenta
                                </button>
                            </div>
                        </div>

                        <!-- Formulario -->
                        <form @submit.prevent="handleLogin" class="space-y-6">
                            <!-- Usuario -->
                            <div class="relative">
                                <input type="text" id="username" v-model="authStore.username"
                                    :disabled="authStore.isBlocked" class="block w-full pl-10 pr-3 py-3 border-0 border-b-2 
                                           bg-transparent focus:outline-none
                                           border-gray-300 dark:border-gray-600
                                           text-gray-800 dark:text-gray-200
                                           focus:border-blue-500" placeholder=" " required
                                    @input="authStore.handleLowerCase" />
                                <label for="username"
                                    class="absolute left-10 top-3 text-gray-500 dark:text-gray-400 transition-all"
                                    :class="{ 'transform -translate-y-6 scale-75 text-blue-500': authStore.username }">
                                    Nombre de usuario
                                </label>
                            </div>

                            <!-- Contraseña -->
                            <div class="relative">
                                <input :type="authStore.showPassword ? 'text' : 'password'" id="password"
                                    v-model="authStore.password" :disabled="authStore.isBlocked" class="block w-full pl-10 pr-10 py-3 border-0 border-b-2 
                                           bg-transparent focus:outline-none
                                           border-gray-300 dark:border-gray-600
                                           text-gray-800 dark:text-gray-200
                                           focus:border-blue-500" placeholder=" " required />
                                <label for="password"
                                    class="absolute left-10 top-3 text-gray-500 dark:text-gray-400 transition-all"
                                    :class="{ 'transform -translate-y-6 scale-75 text-blue-500': authStore.password }">
                                    Contraseña
                                </label>

                                <!-- Ícono Ojo -->
                                <i @click="authStore.showPassword = !authStore.showPassword" :class="[
                                    'pi absolute right-3 top-3 text-xl cursor-pointer transition-all duration-200',
                                    authStore.showPassword
                                        ? 'pi-eye-slash text-gray-600 dark:text-gray-300'
                                        : 'pi-eye text-gray-600 dark:text-gray-300'
                                ]"></i>
                            </div>

                            <!-- Botón ingresar -->
                            <button type="submit" :disabled="authStore.isLoading || authStore.isBlocked" class="relative cursor-pointer w-full bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500
                                       disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition-all
                                       flex items-center justify-center min-h-12">
                                <!-- Spinner con Tailwind CSS -->
                                <div v-if="authStore.isLoading" class="flex items-center justify-center space-x-2">
                                    <div
                                        class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin">
                                    </div>
                                    <span>Procesando...</span>
                                </div>
                                <span v-else>{{ authStore.buttonText }}</span>
                            </button>
                        </form>
                    </div>

                    <!-- Footer -->
                    <div class="mt-8 text-center text-gray-500 dark:text-gray-400 text-xs">
                        <div>{{ version }}</div>
                        <div>© {{ new Date().getFullYear() }} {{ projectName }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth/authStore";
import { useErrorStore } from "@/stores/errors/errorStore";
import TwoFactorAuth from "@/components/security/TwoFactorAuth.vue";

// Router y stores
const router = useRouter();
const authStore = useAuthStore();
const errorStore = useErrorStore();

// Constantes de entorno
const projectName = import.meta.env.VITE_PROJECT_NAME || "Sistema";
const version = import.meta.env.VITE_VERSION || "1.0.0";

/**
 * Maneja el proceso de login
 */
const handleLogin = async (): Promise<void> => {
    if (authStore.isBlocked) {
        errorStore.showMessage('La cuenta está bloqueada temporalmente', 'warning');
        return;
    }

    try {
        // Validar campos requeridos
        if (!authStore.username.trim() || !authStore.password.trim()) {
            errorStore.showMessage('Por favor, completa todos los campos', 'warning');
            return;
        }

        // Ejecutar login pasando el router
        await authStore.login(router);
        // 🔥 AGREGAR DELAY PARA QUE SE VEA EL TOAST
        setTimeout(() => {
            errorStore.showMessage('Inicio de sesión exitoso', 'success', 2000);
        }, 100);

    } catch (error: any) {
        // El error específico ya es manejado por el store
        console.error('❌ Error en login:', error);

        // Mostrar mensaje genérico solo si no es bloqueo de cuenta
        if (error.message !== 'La cuenta está bloqueada temporalmente') {
            errorStore.showMessage('Error al iniciar sesión. Verifica tus credenciales.', 'error');
        }
    }
};

/**
 * Maneja el éxito de la autenticación 2FA
 */
const handle2FASuccess = (data: any): void => {
    try {
        authStore.handle2FASuccess(data);

        if (authStore.twoFAMode !== "setup") {
            // Redirigir después de verificación 2FA exitosa
            const redirectPath = localStorage.getItem("redirectAfterLogin");
            if (redirectPath) {
                localStorage.removeItem("redirectAfterLogin");
                router.push(redirectPath);
            } else {
                router.push("/noticias");
            }
        } else {
            // Mensaje de éxito para configuración 2FA
            errorStore.showMessage("2FA configurado correctamente", "success");
        }
    } catch (error) {
        console.error('Error en handle2FASuccess:', error);
        errorStore.showMessage('Error al procesar la autenticación 2FA', 'error');
    }
};

/**
 * Maneja errores de la autenticación 2FA
 */
const handle2FAError = (message: string): void => {
    console.error('❌ Error 2FA:', message);
    errorStore.showMessage(message, "error");
};

/**
 * Maneja el regreso al home
 */
const handleBackToHome = (): void => {
    router.push('/');
};

/**
 * Limpia el estado al desmontar el componente
 */
const cleanup = (): void => {
    if (authStore.countdownInterval) {
        clearInterval(authStore.countdownInterval);
        authStore.countdownInterval = null;
    }
};

// Lifecycle hooks
onMounted(() => {
    // Verificar si hay bloqueos existentes al cargar el componente
    authStore.checkExistingBlock().catch(error => {
        console.error('Error al verificar bloqueo:', error);
    });
});

onUnmounted(() => {
    cleanup();
});
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Mejoras para accesibilidad */
input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Estilos para el modo oscuro */
@media (prefers-color-scheme: dark) {
    .bg-gray-100 {
        background-color: #1f2937;
    }
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .p-10 {
        padding: 1.5rem;
    }

    .text-2xl {
        font-size: 1.5rem;
    }

    .h-25 {
        height: 6rem;
    }

    .w-64 {
        width: 16rem;
    }
}

/* Mejoras de transición para inputs */
input {
    transition: all 0.3s ease;
}

input:focus {
    transform: translateY(-1px);
}

/* Estilos para el botón deshabilitado */
button:disabled {
    transform: none !important;
}

button:disabled:hover {
    background-color: #9ca3af !important;
}
</style>