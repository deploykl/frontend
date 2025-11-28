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

                    <!-- Contenedor para botones superiores -->
                    <div class="flex justify-between items-center mb-6">
                        <!-- Botón de regreso con animación mejorada -->
                        <button @click="handleBackToHome" class="group relative p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 
                                   transition-all duration-500 cursor-pointer
                                   shadow-lg hover:shadow-xl transform hover:-translate-y-1
                                   bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm
                                   border border-gray-200/50 dark:border-gray-600/50">


                            <!-- Ícono con animación -->
                            <i class="pi pi-home text-gray-600 dark:text-gray-300 text-xl 
                                    group-hover:text-blue-500 dark:group-hover:text-blue-400 
                                    transition-all duration-300 
                                    transform group-hover:scale-110"></i>

                            <!-- Tooltip sutil -->
                            <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                                      opacity-0 group-hover:opacity-100 transition-all duration-300
                                      bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 
                                      text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                                Ir al Inicio
                                <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 
                                          w-2 h-2 bg-gray-800 dark:bg-gray-200 rotate-45"></div>
                            </div>
                        </button>

                        <!-- DarkModeToggle con estilo consistente -->
                        <div class="transform hover:scale-105 transition-transform duration-300">
                            <DarkModeToggle />
                        </div>
                    </div>

                    <!-- Logo y título - SOLO SE MUESTRA EN LOGIN NORMAL -->
                    <div v-if="!authStore.show2FA" class="text-center mb-8">
                        <div class="flex justify-center mb-4">
                            <img src="@/assets/img/account/user-account.png"
                                class="h-25 w-64 object-contain filter drop-shadow-md transform hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 animate-pulse">
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
                            class="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 mb-6 transform hover:scale-[1.02] transition-all duration-300">
                            <div class="flex items-center justify-center space-x-3">
                                <i
                                    class="fas fa-exclamation-triangle text-yellow-600 dark:text-yellow-300 text-xl animate-bounce"></i>
                                <span class="text-sm text-gray-700 dark:text-gray-300">Intentos restantes:</span>
                                <span
                                    class="bg-yellow-600 dark:bg-yellow-300 text-yellow-100 dark:text-yellow-900 px-2 py-1 rounded-full text-xs font-medium transform hover:scale-110 transition-transform">
                                    {{ authStore.remainingAttempts }}
                                </span>
                            </div>
                        </div>

                        <!-- Cuenta bloqueada -->
                        <div v-if="authStore.blockedTimeRemaining > 0"
                            class="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-xl p-4 mb-6 animate-pulse transform hover:scale-[1.02] transition-all duration-300">
                            <div class="flex items-center space-x-3 mb-3">
                                <i class="fas fa-lock text-red-600 dark:text-red-300 text-xl animate-pulse"></i>
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
                            <div class="w-full bg-red-200 dark:bg-red-700 rounded-full h-2 mt-2 overflow-hidden">
                                <div class="bg-red-600 dark:bg-red-400 h-2 rounded-full transition-all duration-1000 ease-out"
                                    :style="{ width: authStore.progressPercentage + '%' }">
                                </div>
                            </div>

                            <!-- Botón para usar otra cuenta -->
                            <div class="mt-4 pt-3 border-t border-red-200 dark:border-red-600">
                                <button @click="authStore.useAnotherAccount"
                                    class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-800/30 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                    <i
                                        class="fas fa-user-plus transform group-hover:rotate-12 transition-transform"></i>
                                    Ingresar con otra cuenta
                                </button>
                            </div>
                        </div>

                        <!-- Formulario -->
                        <form @submit.prevent="handleLogin" class="space-y-6">
                            <!-- Usuario -->
                            <div class="relative group">
                                <input type="text" id="username" v-model="authStore.username"
                                    :disabled="authStore.isBlocked" class="block w-full pl-10 pr-3 py-3 border-0 border-b-2 
                                           bg-transparent focus:outline-none
                                           border-gray-300 dark:border-gray-600
                                           text-gray-800 dark:text-gray-200
                                           focus:border-blue-500 transform transition-all duration-300
                                           group-hover:border-blue-400 group-hover:scale-[1.02]" placeholder=" "
                                    required @input="authStore.handleLowerCase" />
                                <label for="username"
                                    class="absolute left-10 top-3 text-gray-500 dark:text-gray-400 transition-all duration-300"
                                    :class="{ 'transform -translate-y-6 scale-75 text-blue-500': authStore.username }">
                                    Nombre de usuario
                                </label>
                                <i
                                    class="pi pi-user absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-300"></i>
                            </div>

                            <!-- Contraseña -->
                            <div class="relative group">
                                <input :type="authStore.showPassword ? 'text' : 'password'" id="password"
                                    v-model="authStore.password" :disabled="authStore.isBlocked" class="block w-full pl-10 pr-10 py-3 border-0 border-b-2 
                                           bg-transparent focus:outline-none
                                           border-gray-300 dark:border-gray-600
                                           text-gray-800 dark:text-gray-200
                                           focus:border-blue-500 transform transition-all duration-300
                                           group-hover:border-blue-400 group-hover:scale-[1.02]" placeholder=" "
                                    required />
                                <label for="password"
                                    class="absolute left-10 top-3 text-gray-500 dark:text-gray-400 transition-all duration-300"
                                    :class="{ 'transform -translate-y-6 scale-75 text-blue-500': authStore.password }">
                                    Contraseña
                                </label>

                                <i
                                    class="pi pi-lock absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-300"></i>

                                <!-- Ícono Ojo -->
                                <i @click="authStore.showPassword = !authStore.showPassword" :class="[
                                    'pi absolute right-3 top-3 text-xl cursor-pointer transition-all duration-300 transform hover:scale-125',
                                    authStore.showPassword
                                        ? 'pi-eye-slash text-blue-500 dark:text-blue-400'
                                        : 'pi-eye text-gray-600 dark:text-gray-300'
                                ]"></i>
                            </div>

                            <!-- Botón ingresar -->
                            <button type="submit" :disabled="authStore.isLoading || authStore.isBlocked" class="relative cursor-pointer w-full bg-linear-to-r from-gray-700 to-gray-800 
                                       dark:from-gray-600 dark:to-gray-700 
                                       hover:from-gray-800 hover:to-gray-900 
                                       dark:hover:from-gray-500 dark:hover:to-gray-600
                                       disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed 
                                       text-white py-3 px-4 rounded-xl font-semibold transition-all duration-500
                                       flex items-center justify-center min-h-12
                                       transform hover:-translate-y-1 hover:shadow-2xl
                                       disabled:transform-none disabled:hover:shadow-none
                                       group overflow-hidden">

                                <!-- Efecto de brillo al hover -->
                                <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent 
                                          -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                          transition-transform duration-1000"></div>

                                <!-- Spinner con Tailwind CSS -->
                                <div v-if="authStore.isLoading"
                                    class="flex items-center justify-center space-x-2 relative z-10">
                                    <div
                                        class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin">
                                    </div>
                                    <span class="animate-pulse">Procesando...</span>
                                </div>
                                <div v-else
                                    class="flex items-center space-x-2 relative z-10 transform group-hover:scale-105 transition-transform">
                                    <i class="pi pi-sign-in animate-bounce"></i>
                                    <span>{{ authStore.buttonText }}</span>
                                </div>
                            </button>
                        </form>
                    </div>

                    <!-- Footer -->
                    <div
                        class="mt-8 text-center text-gray-500 dark:text-gray-400 text-xs transform hover:scale-105 transition-transform duration-300">
                        <div class="font-semibold">{{ version }}</div>
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
import DarkModeToggle from '@/components/DarkModeToggle.vue'

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

        // Ejecutar login
        await authStore.login(router);
        
        // Mensaje de éxito
        errorStore.showMessage('Inicio de sesión exitoso', 'success', 3000);

    } catch (error: any) {
        console.error('❌ Error en login:', error);
        
        // Manejar diferentes tipos de errores
        if (error.message?.includes('bloqueada')) {
            errorStore.showMessage(error.message, 'warning');
        } else if (error.message?.includes('Credenciales inválidas')) {
            errorStore.showMessage('Usuario o contraseña incorrectos', 'error');
        } else if (error.message?.includes('módulos asignados')) {
            errorStore.showMessage(error.message, 'warning');
        } else {
            errorStore.showMessage(
                error.message || 'Error al iniciar sesión. Verifica tus credenciales.', 
                'error'
            );
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
        transform: translateY(20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
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
    transform: translateY(-1px) scale(1.02);
}

/* Estilos para el botón deshabilitado */
button:disabled {
    transform: none !important;
}

button:disabled:hover {
    background-color: #9ca3af !important;
}

/* Animaciones personalizadas */
@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-5px);
    }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}
</style>