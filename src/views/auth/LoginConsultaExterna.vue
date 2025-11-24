<template>
    <div class="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 flex items-center justify-center p-4">
        <!-- Contenedor principal con efecto glassmorphism -->
        <div class="w-full max-w-5xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-black/30 overflow-hidden border border-white/20 dark:border-gray-700/30 animate-fade-in">
            <div class="flex flex-col lg:flex-row h-full">
                <!-- Sección lateral izquierda - Imagen y branding -->
                <div class="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-linear-to-br from-indigo-600 via-cyan-600 to-blue-700">
                    <!-- Patrón de fondo sutil -->
                    <div class="absolute inset-0 bg-grid-white/[0.02] bg-size-[60px_60px]"></div>
                    
                    <!-- Efectos de gradiente animados -->
                    <div class="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div class="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    
                    <!-- Contenido principal -->
                    <div class="relative z-10 flex flex-col justify-between p-12 h-full">
                        <div class="flex-1 flex flex-col justify-center">
                            <!-- Logo y título -->
                            <div class="text-center mb-8">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 mb-6">
                                    <i class="pi pi-shield text-white text-2xl"></i>
                                </div>
                                <h1 class="text-3xl font-bold text-white mb-3 tracking-tight">
                                    PLATAFORMA<br>DE CONSULTA EXTERNA
                                </h1>
                                <p class="text-blue-100 text-lg font-light">Sistema de Gestión Integral</p>
                            </div>

                            <!-- Características -->
                            <div class="space-y-4 mt-12">
                                <div class="flex items-center space-x-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                    <div class="shrink-0 w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <i class="pi pi-verified text-green-300"></i>
                                    </div>
                                    <div>
                                        <p class="text-white font-medium">Autenticación Segura</p>
                                        <p class="text-blue-200 text-sm">Protección de múltiples capas</p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center space-x-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                    <div class="shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <i class="pi pi-cloud text-green-300"></i>
                                    </div>
                                    <div>
                                        <p class="text-white font-medium">Acceso Remoto</p>
                                        <p class="text-blue-200 text-sm">Disponible 24/7 desde cualquier lugar</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Badge de desarrollo -->
                        <div class="mt-8 p-4 bg-yellow-500/20 backdrop-blur-sm rounded-xl border border-yellow-400/30">
                            <div class="flex items-start space-x-3">
                                <div class="shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <i class="pi pi-code text-white text-xs"></i>
                                </div>
                                <div>
                                    <p class="text-yellow-200 font-semibold text-sm">VERSIÓN EN DESARROLLO</p>
                                    <p class="text-yellow-100 text-xs mt-1 leading-relaxed">
                                        Realizándose pruebas e innovación para la optimización de procesos y toma de decisiones estratégicas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sección del formulario -->
                <div class="w-full lg:w-3/5 p-8 lg:p-12">
                    <!-- Botón de modo oscuro -->
                    <div class="flex justify-end mb-6">
                        <DarkModeToggle />
                    </div>

                    <!-- Header móvil -->
                    <div class="lg:hidden mb-8 text-center">
                        <div class="flex justify-center mb-4">
                            <img src="@/assets/img/account/user-account.png"
                                 class="h-20 w-48 object-contain filter drop-shadow-md" />
                        </div>
                        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">PANEL DE CONTROL</h1>
                        <p class="text-gray-600 dark:text-gray-300 text-sm">Autenticación requerida</p>
                        
                        <!-- Badge móvil -->
                        <div class="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <div class="flex items-center space-x-2">
                                <i class="pi pi-info text-yellow-600 dark:text-yellow-400"></i>
                                <span class="text-yellow-800 dark:text-yellow-200 text-xs font-medium">PLATAFORMA EN DESARROLLO</span>
                            </div>
                        </div>
                    </div>

                    <!-- Logo y título - SOLO SE MUESTRA EN LOGIN NORMAL -->
                    <div v-if="!authStore.show2FA" class="text-center mb-8 hidden lg:block">
                        <div class="flex justify-center mb-4">
                            <img src="@/assets/img/account/user-account.png"
                                 class="h-20 w-48 object-contain filter drop-shadow-md" />
                        </div>
                        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                            PANEL DE CONTROL
                        </h1>
                        <h2 class="text-sm text-gray-600 dark:text-gray-400">Autenticación requerida</h2>
                    </div>

                    <!-- Contenido del formulario -->
                    <div class="max-w-md mx-auto">
                        <!-- 2FA Component -->
                        <TwoFactorAuth v-if="authStore.show2FA" :mode="authStore.twoFAMode"
                                      :userId="authStore.pendingUserId" @success="handle2FASuccess" @error="handle2FAError"
                                      @back="authStore.backToLogin" />

                        <!-- Login Normal -->
                        <div v-else class="space-y-8">
                            <!-- Alertas de seguridad -->
                            <div v-if="authStore.remainingAttempts !== null && authStore.remainingAttempts > 0"
                                 class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                                <div class="flex items-center space-x-3">
                                    <div class="shrink-0 w-8 h-8 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center">
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

                            <!-- Bloqueo de cuenta -->
                            <div v-if="authStore.blockedTimeRemaining > 0"
                                 class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 animate-pulse">
                                <div class="flex items-center space-x-3 mb-3">
                                    <div class="shrink-0 w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
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
                                
                                <!-- Barra de progreso -->
                                <div class="w-full bg-red-200 dark:bg-red-700 rounded-full h-1.5">
                                    <div class="bg-red-500 dark:bg-red-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
                                         :style="{ width: authStore.progressPercentage + '%' }"></div>
                                </div>
                                
                                <button @click="authStore.useAnotherAccount"
                                        class="w-full mt-3 flex items-center justify-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/30 rounded-lg transition-colors text-sm">
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
                                            <i class="pi pi-user text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                                        </div>
                                        <input type="text" id="username" v-model="authStore.username"
                                               :disabled="authStore.isBlocked" 
                                               class="block w-full pl-10 pr-4 py-4 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 
                                                      rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                                                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                                                      transition-all duration-200 backdrop-blur-sm
                                                      disabled:opacity-50 disabled:cursor-not-allowed"
                                               placeholder="Nombre de usuario"
                                               required
                                               @input="authStore.handleLowerCase" />
                                    </div>
                                </div>

                                <!-- Campo Contraseña -->
                                <div class="group">
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i class="pi pi-lock text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                                        </div>
                                        <input :type="authStore.showPassword ? 'text' : 'password'" id="password"
                                               v-model="authStore.password" :disabled="authStore.isBlocked"
                                               class="block w-full pl-10 pr-12 py-4 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 
                                                      rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                                                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                                                      transition-all duration-200 backdrop-blur-sm
                                                      disabled:opacity-50 disabled:cursor-not-allowed"
                                               placeholder="Contraseña"
                                               required />
                                        <button type="button" 
                                                @click="authStore.showPassword = !authStore.showPassword"
                                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                            <i :class="authStore.showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Botón de login -->
                                <button type="submit" 
                                        :disabled="authStore.isLoading || authStore.isBlocked"
                                        class="w-full group relative overflow-hidden bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                                               disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                                               text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300
                                               flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl
                                               transform hover:-translate-y-0.5 disabled:transform-none">
                                    <!-- Efecto de brillo -->
                                    <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    
                                    <!-- Contenido del botón -->
                                    <div v-if="authStore.isLoading" class="flex items-center space-x-2 relative z-10">
                                        <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Verificando...</span>
                                    </div>
                                    <div v-else class="flex items-center space-x-2 relative z-10">
                                        <i class="pi pi-sign-in"></i>
                                        <span>Acceder al Sistema</span>
                                    </div>
                                </button>
                            </form>

                            <!-- Información adicional -->
                            <div class="text-center space-y-4">
                                <div class="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                                    <div class="flex items-center space-x-1">
                                        <i class="pi pi-shield-check"></i>
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStoreConsultaExterna } from "@/stores/auth/authStoreConsultaExterna";
import { useErrorStore } from "@/stores/errors/errorStore";
import TwoFactorAuth from "@/components/security/TwoFactorAuth.vue";
import DarkModeToggle from '@/components/DarkModeToggle.vue'

// Router y stores
const router = useRouter();
const authStore = useAuthStoreConsultaExterna();
const errorStore = useErrorStore();

// Constantes de entorno
const projectName = import.meta.env.VITE_PROJECT_NAME || "Sistema";
const version = import.meta.env.VITE_VERSION || "1.0.0";


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
        
        // 🔥 VERIFICACIÓN ADICIONAL: Si no requiere 2FA, forzar redirección
        if (!authStore.show2FA && !authStore.isLoading) {
            console.log('🚀 Login exitoso, verificando redirección...');
            
            // Pequeño delay para asegurar que el store haya procesado todo
            setTimeout(() => {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    console.log('✅ Token encontrado, redirigiendo...');
                    router.push("/dimon/consulta-externa/index");
                }
            }, 500);
        }
        // Si requiere 2FA, no hacer nada - el handle2FASuccess se encargará

    } catch (error: any) {
        
        if (error.message?.includes('bloqueada')) {
            errorStore.showMessage('La cuenta está bloqueada temporalmente', 'warning');
        } else if (error.response?.status === 401) {
            errorStore.showMessage('Credenciales incorrectas', 'error');
        } else {
            errorStore.showMessage('Error al iniciar sesión', 'error');
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
                router.push("/dimon/consulta-externa/index");
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
    box-shadow: 0 0 0 2px #3b82f6; /* azul estilo Tailwind ring-2 */
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
</style>