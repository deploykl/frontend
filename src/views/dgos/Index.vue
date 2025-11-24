<template>
    <div class="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/20 to-cyan-50/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 overflow-hidden">
        <!-- Header Landing Reutilizado -->
        <HeaderLanding />

        <!-- Contenido Principal -->
        <main class="container mx-auto px-4 py-8 relative">
            <!-- Fondo decorativo animado -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
                <div class="absolute top-1/2 left-1/4 w-60 h-60 bg-linear-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 4s;"></div>
            </div>

            <!-- Header con título y versión -->
            <header class="text-center mb-16 relative z-10">
                <div class="inline-block relative">
                    <!-- Efecto de fondo sutil -->
                    <div class="absolute -inset-8 bg-linear-to-r from-blue-600/5 via-cyan-600/5 to-purple-600/5 dark:from-blue-400/5 dark:via-cyan-400/5 dark:to-purple-400/5 rounded-3xl blur-2xl animate-pulse"></div>

                    <!-- Título principal -->
                    <h1 class="text-6xl md:text-7xl block text-transparent bg-clip-text bg-linear-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 font-bold tracking-tight animate-gradient-x">
                        DGOS
                    </h1>

                    <!-- Línea decorativa animada -->
                    <div class="h-1.5 w-48 bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500 mx-auto rounded-full mt-6 mb-4 shadow-lg animate-width-expand"></div>
                    
                    <!-- Subtítulo -->
                    <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-8">
                        Plataforma integral de gestión y análisis de datos
                    </p>
                </div>
            </header>

            <!-- Sección de Herramientas -->
            <section class="mb-24 relative z-10">
                <div class="text-center mb-16">
                    <!-- Badge de sección mejorado -->
                    <div class="inline-flex items-center justify-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 mb-6 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                        <div class="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-4 shadow-lg">
                            <i class="pi pi-th-large text-white text-xl"></i>
                        </div>
                        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                            Herramientas
                        </h2>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-6 text-xl leading-relaxed">
                        Tecnología que transforma: desarrollo de sistemas digitales modernos y adaptados a tus necesidades.
                    </p>
                </div>

                <!-- Grid de módulos con diseño alternado -->
                <div class="space-y-24">
                    <div v-for="(module, index) in modules" :key="module.id" class="group relative">
                        <!-- Línea conectora decorativa entre módulos -->
                        <div v-if="index < modules.length - 1" class="hidden lg:block absolute left-1/2 top-full -translate-x-1/2 w-1 h-24 bg-linear-to-b from-blue-300/50 via-cyan-300/50 to-purple-300/50 dark:from-blue-700/50 dark:via-cyan-700/50 dark:to-purple-700/50 rounded-full z-0"></div>
                        
                        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
                            <!-- Lado izquierdo: Icono grande y decoraciones -->
                            <div class="w-full lg:w-2/5" :class="index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'">
                                <div class="relative">
                                    <!-- Efecto de fondo animado -->
                                    <div class="absolute -ins-6 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-1000"
                                        :style="{ background: `linear-gradient(135deg, ${module.color}20 0%, ${getDarkerColor(module.color)}10 100%)` }">
                                    </div>
                                    
                                    <!-- Icono principal grande -->
                                    <div class="icon-container w-48 h-48 lg:w-64 lg:h-64 mx-auto rounded-[2.5rem] text-white shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-3xl flex items-center justify-center relative overflow-hidden"
                                        :style="{
                                            background: `linear-gradient(135deg, ${module.color} 0%, ${getDarkerColor(module.color)} 100%)`,
                                            boxShadow: `0 25px 50px ${module.color}40, 0 15px 30px ${module.color}20, inset 0 1px 0 ${module.color}30`
                                        }">
                                        
                                        <!-- Efecto de brillo interno -->
                                        <div class="absolute inset-0 bg-linear-to-br from-white/20 to-transparent rounded-[2.5rem]"></div>
                                        
                                        <!-- Icono -->
                                        <i :class="module.icon" class="icon-max-size relative z-10"></i>
                                        
                                        <!-- Efecto de partículas animadas -->
                                        <div v-for="n in 5" :key="n" 
                                            class="absolute w-4 h-4 rounded-full bg-white/30 animate-float"
                                            :style="{
                                                top: `${Math.random() * 80 + 10}%`,
                                                left: `${Math.random() * 80 + 10}%`,
                                                animationDelay: `${n * 0.5}s`
                                            }">
                                        </div>
                                    </div>

                                    <!-- Elementos decorativos animados -->
                                    <div class="absolute -top-6 -left-6 w-16 h-16 rounded-full opacity-70 group-hover:scale-150 group-hover:opacity-90 transition-all duration-1000 animate-float-slow"
                                        :style="{ backgroundColor: module.color }"></div>
                                    <div class="absolute -bottom-4 -right-4 w-14 h-14 rounded-full opacity-50 group-hover:scale-125 group-hover:opacity-80 transition-all duration-1000 delay-300 animate-float-slow" 
                                        :style="{ backgroundColor: module.color, animationDelay: '1s' }"></div>
                                    <div class="absolute top-1/2 -right-8 w-12 h-12 rounded-lg opacity-40 group-hover:scale-110 group-hover:rotate-45 transition-all duration-1000 delay-500 animate-float-slow"
                                        :style="{ backgroundColor: module.color, animationDelay: '2s' }"></div>
                                </div>
                            </div>

                            <!-- Lado derecho: Contenido -->
                            <div class="w-full lg:w-3/5" :class="index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'">
                                <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-gray-100/50 dark:border-gray-700/50 transition-all duration-700 group-hover:shadow-3xl group-hover:-translate-y-3 relative overflow-hidden"
                                    :class="{
                                        'cursor-pointer hover:border-blue-300/50 dark:hover:border-blue-600/50': module.status === 'enabled',
                                        'opacity-70': module.status !== 'enabled'
                                    }" @click="handleModuleClick(module)">
                                    
                                    <!-- Efecto de borde animado -->
                                    <div class="absolute inset-0 rounded-[2.5rem] bg-linear-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    
                                    <!-- Badge de estado mejorado -->
                                    <div class="mb-6 relative z-10">
                                        <span v-if="module.status === 'maintenance'"
                                            class="inline-flex items-center px-5 py-3 rounded-2xl text-base font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-2 border-red-200 dark:border-red-800 shadow-lg animate-pulse">
                                            <i class="pi pi-info-circle mr-3 text-lg"></i> En Mantenimiento
                                        </span>
                                        <span v-else-if="module.status === 'disabled'"
                                            class="inline-flex items-center px-5 py-3 rounded-2xl text-base font-bold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                                            <i class="pi pi-ban mr-3 text-lg"></i> Desactivado
                                        </span>
                                        <span v-else-if="module.status === 'coming-soon'"
                                            class="inline-flex items-center px-5 py-3 rounded-2xl text-base font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-2 border-yellow-200 dark:border-yellow-800 shadow-lg animate-pulse">
                                            <i class="pi pi-clock mr-3 text-lg"></i> Próximamente
                                        </span>
                                        <span v-else
                                            class="inline-flex items-center px-5 py-3 rounded-2xl text-base font-bold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-2 border-green-200 dark:border-green-800 shadow-lg">
                                            <i class="pi pi-check-circle mr-3 text-lg"></i> Disponible
                                        </span>
                                    </div>

                                    <!-- Título y descripción -->
                                    <h3 class="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white mb-6 leading-tight relative z-10">
                                        {{ module.title }}
                                    </h3>
                                    <p class="text-gray-600 dark:text-gray-400 text-xl leading-relaxed mb-8 relative z-10">
                                        {{ module.description }}
                                    </p>

                                    <!-- Botón de Acción mejorado -->
                                    <div class="flex justify-start mt-8 relative z-10">
                                        <button v-if="module.status === 'enabled' && module.id !== 4"
                                            @click.stop="handleModuleAction(module)"
                                            class="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg group/btn relative overflow-hidden"
                                            :style="{
                                                background: `linear-gradient(135deg, ${module.color} 0%, ${getDarkerColor(module.color)} 100%)`,
                                                color: 'white'
                                            }" :class="{
                                                'hover:shadow-xl': isAuthenticated,
                                                'animate-pulse': !isAuthenticated
                                            }">
                                            <!-- Efecto de brillo en hover -->
                                            <span class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                                            <i class="pi pi-arrow-right mr-3 text-xl relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300"></i>
                                            <span class="relative z-10 cursor-pointer">{{ isAuthenticated ? 'Acceder' : 'Iniciar Sesión' }}</span>
                                        </button>

                                        <!-- Botón especial para módulo 4 (sin login) -->
                                        <button v-else-if="module.status === 'enabled' && module.id === 4"
                                            @click.stop="handleModuleAction(module)"
                                            class="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg group/btn relative overflow-hidden"
                                            :style="{
                                                background: `linear-gradient(135deg, ${module.color} 0%, ${getDarkerColor(module.color)} 100%)`,
                                                color: 'white'
                                            }">
                                            <!-- Efecto de brillo en hover -->
                                            <span class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                                            <i class="pi pi-external-link mr-3 text-xl relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300"></i>
                                            <span class="relative z-10">Acceder</span>
                                        </button>
                                    </div>

                                    <!-- Línea decorativa inferior con color del módulo -->
                                    <div class="h-1.5 w-32 rounded-full mt-8 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:w-40 relative z-10"
                                        :style="{ background: `linear-gradient(90deg, ${module.color} 0%, ${getDarkerColor(module.color)} 100%)` }">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Sección Centro de Ayuda -->
            <section class="mb-20 relative z-10">
                <div class="text-center mb-16">
                    <div class="inline-flex items-center justify-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                        <div class="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-4 shadow-lg">
                            <i class="pi pi-envelope text-white text-xl"></i>
                        </div>
                        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                            Centro de Ayuda
                        </h2>
                    </div>
                </div>

                <div class="max-w-3xl mx-auto">
                    <div class="bg-linear-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-12 text-center border border-gray-100/50 dark:border-gray-700/50 relative overflow-hidden group">
                        <!-- Efecto de fondo animado -->
                        <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        <div class="w-24 h-24 bg-linear-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl relative overflow-hidden">
                            <!-- Efecto de brillo interno -->
                            <div class="absolute inset-0 bg-linear-to-br from-white/20 to-transparent rounded-3xl"></div>
                            <i class="pi pi-headphones text-white text-4xl relative z-10 custom-icon-size"></i>
                        </div>
                        <h3 class="text-3xl font-black text-gray-800 dark:text-white mb-6 relative z-10">Soporte Técnico Especializado</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-xl mb-8 leading-relaxed relative z-10">
                            Estamos aquí para ayudarte con cualquier consulta o problema técnico.
                        </p>
                        <div class="flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl relative z-10 group/link">
                            <i class="pi pi-envelope mr-4 text-2xl group-hover/link:scale-110 transition-transform duration-300"></i>
                            <a :href="`mailto:${soporte}`"
                                class="hover:underline transition-all duration-300 hover:text-blue-700 dark:hover:text-blue-300 group-hover/link:scale-105 transform">
                                {{ soporte }}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HeaderLanding from '@/components/layout/HeaderLanding.vue';
import Footer from '@/components/layout/Footer.vue'

// Variables de entorno
const soporte = import.meta.env.VITE_SOPORTE
const router = useRouter();

// Variables para el modal de Power BI
const powerBIVisible = ref(false);
const currentPowerBIUrl = ref('');
const currentPowerBITitle = ref('');

const isAuthenticated = computed(() => {
    const token = localStorage.getItem('auth_token');
    return !!token;
});

// Función para oscurecer colores
const getDarkerColor = (color: string): string => {
    if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const amt = -40;
        const R = Math.max(0, Math.min(255, ((num >> 16) + amt)));
        const G = Math.max(0, Math.min(255, (((num >> 8) & 0x00FF) + amt)));
        const B = Math.max(0, Math.min(255, ((num & 0x0000FF) + amt)));
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
    return color;
};

// Definición de módulos
interface Module {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
    path: string;
    status: 'enabled' | 'disabled' | 'maintenance' | 'coming-soon';
    type?: 'powerbi' | 'external';
}

const modules = ref<Module[]>([
     {
        id: 1,
        title: 'Gestión de colaboradores',
        description: 'RR. HH',
        icon: 'pi pi-users',
        color: '#6f42c1',
        path: '/dgos/personal/dashboard',
        status: 'enabled'
    },
    {
        id: 2,
        title: 'Presupuesto',
        description: 'Seguimiento de presupuesto y gastos',
        icon: 'pi pi-money-bill',
        color: '#ffb300',
        path: 'https://app.powerbi.com/view?r=eyJrIjoiNzVmNDI3YmItNmRlNi00OWFjLWE0MTQtMDI4MmFjOTQ1MWMxIiwidCI6Ijc5MDVjMWZjLTkzM2MtNDUyYS04YjgzLWIyZTU2NDU1ZDE2YSIsImMiOjR9',
        status: 'enabled',
        type: 'powerbi'
    },
    {
        id: 3,
        title: 'Informática',
        description: 'Control de equipos y recursos tecnológicos',
        icon: 'pi pi-desktop',
        color: '#28a745',
        path: '/dgos/token',
        status: 'enabled'
    },
    {
        id: 4,
        title: 'Plan Operativo',
        description: 'Gestión operativa institucional',
        icon: 'pi pi-calendar',
        color: '#ED6A5A',
        path: 'http://172.27.0.200/login',
        //path: '/dgos/poi',
        status: 'enabled'
    },
    {
        id: 5,
        title: 'Patrimonio',
        description: 'Control de bienes y activos',
        icon: 'pi pi-briefcase',
        color: '#4C7C89',
        path: '/dgos/patrimonio',
        status: 'enabled'
    },
])

// Manejo de clics en módulos (para el click en toda la tarjeta)
const handleModuleClick = (module: Module) => {
    if (module.status !== 'enabled') {
        if (module.status === 'maintenance') {
            alert('Este módulo está en mantenimiento 🔧');
        } else if (module.status === 'coming-soon') {
            alert('Este módulo estará disponible próximamente 🚀');
        }
        return;
    }

    // Solo procesar si no es un módulo que requiere autenticación (excepto módulo 4)
    if (module.id !== 4 && !isAuthenticated.value) {
        return; // Dejar que el botón maneje la redirección al login
    }

    redirectToModule(module);
};

// NUEVA FUNCIÓN: Manejo específico del botón de acción
const handleModuleAction = (module: Module) => {
    if (module.status !== 'enabled') return;

    // Módulo 4: acceso directo sin autenticación
    if (module.id === 4) {
        redirectToModule(module);
        return;
    }

    // Para otros módulos: verificar autenticación
    if (!isAuthenticated.value) {
        localStorage.setItem('redirectAfterLogin', module.path);
        router.push('/login');
        return;
    }

    redirectToModule(module);
};

const redirectToModule = (module: Module) => {
    if (module.type === 'powerbi') {
        currentPowerBIUrl.value = module.path;
        currentPowerBITitle.value = module.title;
        powerBIVisible.value = true;
        return;
    }

    console.log('[redirectToModule] Intentando ir a:', module.path);
    router.push(module.path);
};

// Efecto de aparición progresiva para las tarjetas
onMounted(() => {
    const cards = document.querySelectorAll('.group');
    cards.forEach((card, index) => {
        (card as HTMLElement).style.animationDelay = `${index * 0.3}s`;
    });

    // Guardar página de origen
    localStorage.setItem('originPage', '/dimon');
});
</script>

<style scoped>
.group {
    animation: fadeInUp 1s ease-out forwards;
    opacity: 0;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(60px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Animaciones personalizadas */
@keyframes pulse-slow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
}

@keyframes gradient-x {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes width-expand {
    0% { width: 0; opacity: 0; }
    100% { width: 12rem; opacity: 1; }
}

@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
}

@keyframes float-slow {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-15px) scale(1.05); }
}

.animate-pulse-slow {
    animation: pulse-slow 6s ease-in-out infinite;
}

.animate-gradient-x {
    background-size: 200% auto;
    animation: gradient-x 3s ease infinite;
}

.animate-width-expand {
    animation: width-expand 1.5s ease-out forwards;
    animation-delay: 0.5s;
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

.animate-float-slow {
    animation: float-slow 4s ease-in-out infinite;
}

/* Mejoras para móvil */
@media (max-width: 768px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
    
    .animate-width-expand {
        animation: width-expand 1.5s ease-out forwards;
        width: 8rem !important;
    }
}

/* Efectos de glassmorphism mejorados */
.backdrop-blur-xl {
    backdrop-filter: blur(20px);
}

/* Estilos personalizados para iconos grandes */
.icon-max-size {
    font-size: 5rem !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transform: scale(1.3) !important;
}

/* Para móviles */
@media (max-width: 768px) {
    .icon-max-size {
        font-size: 4rem !important;
        transform: scale(1.2) !important;
    }
}

/* Asegurar que los iconos PrimeIcons sean flexibles */
.pi {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.group {
    animation: fadeInUp 1s ease-out forwards;
    opacity: 0;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(60px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Mejoras para móvil */
@media (max-width: 768px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}

.custom-icon-size {
    font-size: 3rem !important;
    width: 3rem !important;
    height: 3rem !important;
}

</style>