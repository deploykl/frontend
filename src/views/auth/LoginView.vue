<template>
    <!-- Estado de carga inicial -->
    <div v-if="!isAppReady" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-all duration-800">
        <div class="text-center space-y-6">
            <!-- Logo animado -->
            <div class="relative">
                <div class="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse">
                    <i class="pi pi-shield text-white text-2xl"></i>
                </div>
                <div class="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-ping opacity-20"></div>
            </div>
            
            <!-- Texto de carga -->
            <div class="space-y-2">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white">Cargando Login</h2>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Inicializando componentes...</p>
            </div>
            
            <!-- Barra de progreso -->
            <div class="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden">
                <div class="h-full bg-blue-600 rounded-full animate-progress"></div>
            </div>
        </div>
    </div>

    <!-- Loading Screen después del login -->
    <LoadingScreen 
        v-if="showLoadingScreen"
        :show="true"
        :duration="6000"
        @complete="handleLoadingComplete"
    />

    <!-- Contenido principal del login -->
    <div v-else-if="isAppReady"
        class="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 flex items-center justify-center p-4">
        <!-- Fondo GIF mejorado -->
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10"
            :style="{ backgroundImage: `url('/src/assets/gif/city2.gif')` }"></div>

        <!-- Contenedor principal con efecto glassmorphism -->
        <div
            class="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-black/30 overflow-hidden border border-white/20 dark:border-gray-700/30 animate-fade-in">

            <!-- Contenedor interno -->
            <div class="p-8 lg:p-10">
                <!-- Contenedor para botones superiores -->
                <div class="flex justify-between items-center mb-8">
                    <!-- Botón de regreso con estilo mejorado -->
                    <button @click="handleBackToHome" class="group relative p-3 rounded-2xl hover:bg-white/60 dark:hover:bg-gray-700/60 
                                   transition-all duration-500 cursor-pointer
                                   shadow-lg hover:shadow-xl transform hover:-translate-y-1
                                   bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm
                                   border border-white/30 dark:border-gray-600/30">

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
                    <div class="flex justify-center mb-6">
                        <img src="@/assets/img/account/user-account.png"
                            class="h-20 w-48 object-contain filter drop-shadow-md transform hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 tracking-tight">
                        PANEL DE CONTROL
                    </h1>
                    <h2 class="text-sm text-gray-600 dark:text-gray-400 font-light">Autenticación requerida</h2>
                </div>

                <ErrorMessage />

                <!-- 2FA Component -->
                <TwoFactorAuth v-if="authStore.show2FA" :mode="authStore.twoFAMode" :userId="authStore.pendingUserId"
                    @success="handle2FASuccess" @error="handle2FAError" @back="authStore.backToLogin" />

                <!-- Login Normal -->
                <div v-else class="space-y-6">
                    <!-- INTENTOS RESTANTES - CORREGIDO -->
                    <div v-if="authStore.remainingAttempts !== null && authStore.remainingAttempts > 0"
                        class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 backdrop-blur-sm">
                        <div class="flex items-center space-x-3">
                            <div
                                class="shrink-0 w-8 h-8 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center">
                                <i class="pi pi-exclamation-triangle text-amber-600 dark:text-amber-400 text-sm"></i>
                            </div>
                            <div class="flex-1">
                                <p class="text-amber-800 dark:text-amber-200 text-sm font-medium">
                                    Intentos restantes:
                                    <span class="bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-bold ml-2">
                                        {{ authStore.remainingAttempts }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- BLOQUEO DE CUENTA - CORREGIDO -->
                    <div v-if="authStore.blockedTimeRemaining > 0"
                        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 animate-pulse backdrop-blur-sm">
                        <div class="flex items-center space-x-3 mb-3">
                            <div
                                class="shrink-0 w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                                <i class="pi pi-lock text-red-600 dark:text-red-400 text-sm"></i>
                            </div>
                            <div class="flex-1">
                                <p class="text-red-800 dark:text-red-200 text-sm font-medium">
                                    Cuenta bloqueada temporalmente
                                </p>
                                <p class="text-red-600 dark:text-red-300 text-xs mt-1">
                                    Tiempo restante: {{ authStore.formatTime(authStore.blockedTimeRemaining) }}
                                </p>
                            </div>
                        </div>

                        <!-- Barra de progreso - CORREGIDA -->
                        <div class="w-full bg-red-200 dark:bg-red-700 rounded-full h-2 mb-3">
                            <div class="bg-red-500 dark:bg-red-400 h-2 rounded-full transition-all duration-1000 ease-out"
                                :style="{ width: authStore.progressPercentage + '%' }"></div>
                        </div>

                        <button @click="authStore.useAnotherAccount"
                            class="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/30 rounded-lg transition-colors text-sm">
                            <i class="pi pi-user-plus"></i>
                            <span>Usar otra cuenta</span>
                        </button>
                    </div>

                    <!-- Formulario de login -->
                    <form @submit.prevent="handleLogin" class="space-y-6">
                        <!-- Campo Usuario -->
                        <div class="group">
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i
                                        class="pi pi-user text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                                </div>
                                <input type="text" id="username" v-model="authStore.username"
                                    :disabled="authStore.isBlocked" class="block w-full pl-10 pr-4 py-4 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 
                                                      rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                                                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                                                      transition-all duration-200 backdrop-blur-sm
                                                      disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Nombre de usuario" required @input="authStore.handleLowerCase" />
                            </div>
                        </div>

                        <!-- Campo Contraseña -->
                        <div class="group">
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i
                                        class="pi pi-lock text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                                </div>
                                <input :type="authStore.showPassword ? 'text' : 'password'" id="password"
                                    v-model="authStore.password" :disabled="authStore.isBlocked" class="block w-full pl-10 pr-12 py-4 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 
                                                      rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                                                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                                                      transition-all duration-200 backdrop-blur-sm
                                                      disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Contraseña" required />
                                <button type="button" @click="authStore.showPassword = !authStore.showPassword"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                    <i :class="authStore.showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Botón de login -->
                        <button type="submit" :disabled="authStore.isLoading || authStore.isBlocked" class="w-full group relative overflow-hidden bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                                               disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                                               text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300
                                               flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl
                                               transform hover:-translate-y-0.5 disabled:transform-none">
                            <!-- Efecto de brillo -->
                            <div
                                class="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
                            </div>

                            <!-- Contenido del botón -->
                            <div v-if="authStore.isLoading" class="flex items-center space-x-2 relative z-10">
                                <div
                                    class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin">
                                </div>
                                <span>Verificando...</span>
                            </div>
                            <div v-else class="flex items-center space-x-2 relative z-10">
                                <i class="pi pi-sign-in"></i>
                                <span>{{ authStore.buttonText }}</span>
                            </div>
                        </button>
                    </form>

                    <!-- Información adicional -->
                    <div class="text-center space-y-4">
                        <div
                            class="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                            <div class="flex items-center space-x-1">
                                <i class="bi bi-shield-check"></i>
                                <span>Conexión segura</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <i class="pi pi-clock"></i>
                                <span>24/7 Disponible</span>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div class="text-gray-500 dark:text-gray-400 text-xs space-y-1">
                                <div class="flex items-center justify-center space-x-2">
                                    <i class="pi pi-code"></i>
                                    <span>{{ version }} - Sistema en Desarrollo Activo</span>
                                </div>
                                <div>© {{ new Date().getFullYear() }} {{ projectName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth/authStore";
import { useErrorStore } from "@/stores/errors/errorStore";
import TwoFactorAuth from "@/components/security/TwoFactorAuth.vue";
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import LoadingScreen from '@/components/ui/LoadingScreen.vue';
import ErrorMessage from '@/components/utils/ErrorMessage.vue';

// Router y stores
const router = useRouter();
const authStore = useAuthStore();
const errorStore = useErrorStore();

// Estados reactivos
const isAppReady = ref(false);
const showLoadingScreen = ref(false);

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

        // ✅ MOSTRAR LOADING SCREEN Y NO REDIRIGIR INMEDIATAMENTE
        showLoadingScreen.value = true;

    } catch (error: any) {
        console.error('❌ Error en login:', error);

        // ✅ MOSTRAR EL MENSAJE DIRECTAMENTE DEL BACKEND
        if (error.response?.data?.detail) {
            errorStore.showMessage(error.response.data.detail, 'error');
            
            // ✅ ACTUALIZAR INTENTOS RESTANTES SI VIENEN DEL BACKEND
            if (error.response.data.remaining_attempts !== undefined) {
                authStore.remainingAttempts = error.response.data.remaining_attempts;
            }
        } 
        // Manejar diferentes tipos de errores
        else if (error.message?.includes('bloqueada')) {
            errorStore.showMessage(error.message, 'warning');
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
 * Maneja la finalización del loading screen
 */
const handleLoadingComplete = (): void => {
    // Redirigir después de que el loading termine
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
    } else {
        router.push("/noticias");
    }
    
    // Mostrar mensaje de éxito
    errorStore.showMessage('Inicio de sesión exitoso', 'success', 3000);
};

/**
 * Maneja el éxito de la autenticación 2FA
 */
const handle2FASuccess = (data: any): void => {
    try {
        authStore.handle2FASuccess(data);

        if (authStore.twoFAMode !== "setup") {
            // Mostrar loading screen en lugar de redirigir inmediatamente
            showLoadingScreen.value = true;
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
    // Simular tiempo de carga inicial
    setTimeout(() => {
        isAppReady.value = true;
    }, 800);

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
    animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.bg-grid-white\/\[0\.02\] {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.02)'%3e%3cpath d='m0 16h32m-16-16v32'/%3e%3c/svg%3e");
}

/* Mejoras de accesibilidad y enfoque */
input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
}

/* Transiciones suaves */
* {
    transition-property: color, background-color, border-color, transform, box-shadow;
    transition-duration: 200ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efectos de profundidad */
.shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Mejoras para modo oscuro */
@media (prefers-color-scheme: dark) {
    .backdrop-blur-xl {
        backdrop-filter: blur(24px);
    }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .p-12 {
        padding: 2rem;
    }
}

@media (max-width: 768px) {
    .p-12 {
        padding: 1.5rem;
    }

    .rounded-3xl {
        border-radius: 1.5rem;
    }
}

/* Scroll suave */
html {
    scroll-behavior: smooth;
}

/* Mejoras para accesibilidad */
input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
.animate-progress {
    animation: progress 1.5s ease-in-out infinite;
}

@keyframes progress {
    0% {
        transform: translateX(-100%);
        width: 20%;
    }
    50% {
        transform: translateX(0%);
        width: 60%;
    }
    100% {
        transform: translateX(100%);
        width: 20%;
    }
}

/* Asegurar que el contenido esté oculto hasta que Vue monte */
[v-cloak] {
    display: none;
}

/* Estilos específicos para la barra de progreso del bloqueo */
.bg-red-200 {
    background-color: #fed7d7;
}
.dark .bg-red-700 {
    background-color: #742a2a;
}
.bg-red-500 {
    background-color: #f56565;
}
.dark .bg-red-400 {
    background-color: #fc8181;
}
</style>