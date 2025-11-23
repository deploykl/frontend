<template>
    <div
        class="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/20 to-cyan-50/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
        <!-- Header Landing Reutilizado -->
        <HeaderLanding />

        <!-- Contenido Principal -->
        <main class="container mx-auto px-4 py-8">
            <!-- Header con título y versión -->
            <header class="text-center mb-8">
                <div class="inline-block relative">
                    <!-- Efecto de fondo sutil -->
                    <div
                        class="absolute -inset-6 bg-linear-to-r from-blue-600/5 via-cyan-600/5 to-purple-600/5 dark:from-blue-400/5 dark:via-cyan-400/5 dark:to-purple-400/5 rounded-3xl blur-xl">
                    </div>
                    <h1
                        class=" text-6xl block md:inline text-transparent bg-clip-text bg-linear-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 font-arkhip animate-pulse bg-size-[200%_auto] hover:animate-none transition-all duration-1000 hover:bg-size-[100%_auto]">
                        DIMON
                    </h1>
                    <div
                        class="h-2 w-40 bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500 mx-auto rounded-full mb-4 shadow-lg">
                    </div>
                </div>
            </header>

            <!-- Sección de Herramientas -->
            <section class="mb-24">
                <div class="text-center mb-16">
                    <!-- Badge de sección -->
                    <div
                        class="inline-flex items-center justify-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 mb-6">
                        <i class="pi pi-th-large text-3xl text-blue-500 mr-4 custom-icon-size"></i>
                        <h2 class="text-3xl md:text-3xl font-bold text-gray-800 dark:text-white">
                            Herramientas
                        </h2>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-6 text-xl leading-relaxed">
                        Tecnología que transforma: desarrollo de sistemas digitales modernos y adaptados a tus
                        necesidades.
                    </p>
                </div>

                <!-- Grid de módulos alternados izquierda-derecha -->
                <div class="space-y-10">
                    <div v-for="(module, index) in modules" :key="module.id" class="group relative">
                        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                            <!-- Lado izquierdo: Icono grande y decoraciones -->
                            <div class="w-full lg:w-2/5 order-1" :class="index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'">
                                <div class="relative">
                                    <!-- Icono principal grande - CON CSS PERSONALIZADO -->
                                    <div class="icon-container w-48 h-48 lg:w-64 lg:h-64 mx-auto rounded-[2.5rem] text-white shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-3xl flex items-center justify-center relative overflow-hidden"
                                        :style="{
                                            background: `linear-gradient(135deg, ${module.color} 0%, ${getDarkerColor(module.color)} 100%)`,
                                            boxShadow: `0 25px 50px ${module.color}50, 0 15px 30px ${module.color}30`
                                        }">

                                        <i :class="module.icon" class="icon-max-size"></i>

                                        <!-- Efecto de brillo overlay -->
                                        <div
                                            class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]">
                                        </div>
                                    </div>

                                    <!-- Elementos decorativos animados - ACTUALIZADOS -->
                                    <div class="absolute -top-8 -left-8 w-16 h-16 rounded-full opacity-70 group-hover:scale-150 group-hover:opacity-90 transition-all duration-1000"
                                        :style="{ backgroundColor: module.color }"></div>
                                    <div class="absolute -bottom-6 -right-6 w-14 h-14 rounded-full opacity-50 group-hover:scale-125 group-hover:opacity-80 transition-all duration-1000 delay-300"
                                        :style="{ backgroundColor: module.color }"></div>
                                    <div class="absolute top-1/2 -right-12 w-12 h-12 rounded-lg opacity-40 group-hover:scale-110 group-hover:rotate-45 transition-all duration-1000 delay-500"
                                        :style="{ backgroundColor: module.color }"></div>
                                </div>
                            </div>

                            <!-- Lado derecho: Contenido -->
                            <div class="w-full lg:w-3/5 order-2" :class="index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'">
                                <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-[2.5rem] p-10 shadow-2xl border border-gray-100/50 dark:border-gray-700/50 transition-all duration-700 group-hover:shadow-3xl group-hover:-translate-y-3"
                                    :class="{
                                        'cursor-pointer hover:border-blue-300/50 dark:hover:border-blue-600/50': module.status === 'enabled',
                                        'opacity-70': module.status !== 'enabled'
                                    }" @click="handleModuleClick(module)">
                                    <!-- Badge de estado mejorado -->
                                    <div class="mb-6">
                                        <span v-if="module.status === 'maintenance'"
                                            class="inline-flex items-center px-5 py-3 rounded-2xl text-base font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-2 border-red-200 dark:border-red-800 shadow-lg">
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
                                    <h3
                                        class="text-3xl lg:text-3xl font-black text-gray-800 dark:text-white mb-6 leading-tight">
                                        {{ module.title }}
                                    </h3>
                                    <p class="text-gray-600 dark:text-gray-400 text-xl leading-relaxed mb-8">
                                        {{ module.description }}
                                    </p>

                                    <!-- Botón de Acción - NUEVO -->
                                    <div class="flex justify-start mt-8">
                                        <button v-if="module.status === 'enabled' && module.id !== 4"
                                            @click.stop="handleModuleAction(module)"
                                            class="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                            :style="{
                                                background: `linear-gradient(135deg, ${module.color} 0%, ${getDarkerColor(module.color)} 100%)`,
                                                color: 'white'
                                            }" :class="{
                                                'hover:shadow-xl': isAuthenticated,
                                                'animate-pulse': !isAuthenticated
                                            }">
                                            <i class="pi pi-arrow-right mr-3 text-xl"></i>
                                            {{ isAuthenticated ? 'Acceder' : 'Iniciar Sesión' }}
                                        </button>

                                        <!-- Botón especial para módulo 4 (sin login) -->
                                        <button v-else-if="module.status === 'enabled' && module.id === 4"
                                            @click.stop="handleModuleAction(module)"
                                            class="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                            :style="{
                                                background: `linear-gradient(135deg, ${module.color} 0%, ${getDarkerColor(module.color)} 100%)`,
                                                color: 'white'
                                            }">
                                            <i class="pi pi-external-link mr-3 text-xl"></i>
                                            Acceder
                                        </button>
                                    </div>

                                    <!-- Línea decorativa inferior con color del módulo -->
                                    <div class="h-1.5 w-32 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full mt-8 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:w-40"
                                        :style="{ background: `linear-gradient(90deg, ${module.color} 0%, ${getDarkerColor(module.color)} 100%)` }">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Línea conectora decorativa entre módulos -->
                        <div v-if="index < modules.length - 1"
                            class="hidden lg:block absolute left-1/2 top-full -translate-x-1/2 w-1 h-16 bg-linear-to-b from-blue-300/50 via-cyan-300/50 to-purple-300/50 dark:from-blue-700/50 dark:via-cyan-700/50 dark:to-purple-700/50 rounded-full">
                        </div>
                    </div>
                </div>
            </section>

            <!-- Sección Centro de Ayuda -->
            <section class="mb-20">
                <div class="text-center mb-16">
                    <div
                        class="inline-flex items-center justify-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                        <i class="pi pi-envelope text-3xl text-blue-500 mr-4 custom-icon-size"></i>
                        <h2 class="text-3xl md:text-3xl font-bold text-gray-800 dark:text-white">
                            Centro de Ayuda
                        </h2>
                    </div>
                </div>

                <div class="max-w-3xl mx-auto">
                    <div
                        class="bg-linear-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm rounded-[2.5rem] shadow-2xl p-12 text-center border border-gray-100/50 dark:border-gray-700/50">
                        <div
                            class="w-24 h-24 bg-linear-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                            <i class="pi pi-headphones text-white custom-icon-size"></i>
                        </div>
                        <h3 class="text-3xl font-black text-gray-800 dark:text-white mb-6">Soporte Técnico Especializado
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 text-xl mb-8 leading-relaxed">
                            Estamos aquí para ayudarte con cualquier consulta o problema técnico.
                        </p>
                        <div
                            class="flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
                            <i class="pi pi-envelope mr-4 text-2xl"></i>
                            <a :href="`mailto:${soporte}`"
                                class="hover:underline transition-all duration-300 hover:text-blue-700 dark:hover:text-blue-300 hover:scale-105 transform">
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
        title: 'Tableros de Gestión',
        description: 'Accede a todos tus dashboards y tableros estratégicos en Power BI, Tableau y más, con indicadores clave en tiempo real para una toma de decisiones informada.',
        icon: 'pi pi-chart-line',
        color: '#007bff',
        path: '/dimon/tablero',
        status: 'enabled'
    },
    {
        id: 2,
        title: 'Indicadores Institucionales',
        description: 'Visualiza y analiza las métricas institucionales más importantes con reportes Power BI avanzados y visualizaciones interactivas.',
        icon: 'pi pi-chart-scatter',
        color: '#198754',
        path: 'https://app.powerbi.com/view?r=eyJrIjoiYzdjYmM3ZTMtM2Q1ZS00OTIyLWIxOGItNmRmYmIxNTE4MmU5IiwidCI6Ijc5MDVjMWZjLTkzM2MtNDUyYS04YjgzLWIyZTU2NDU1ZDE2YSIsImMiOjR9',
        status: 'enabled',
        type: 'powerbi'
    },
    {
        id: 3,
        title: 'Sistema de Gestión Documental',
        description: 'Gestiona y realiza seguimiento de documentos pendientes en el sistema SGD de manera eficiente y organizada.',
        icon: 'pi pi-chart-bar',
        color: '#ffc107',
        path: '/dimon/sgd',
        status: 'enabled'
    },
    {
        id: 4,
        title: 'Fichas de Emergencia',
        description: 'Consulta y gestiona las fichas de emergencia con acceso rápido, intuitivo y sin requerimientos de autenticación.',
        icon: 'pi pi-file',
        color: '#dc3545',
        path: '/dimon/emergencia',
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

/* Mejoras para móvil */
@media (max-width: 768px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}

/* Efectos de glassmorphism mejorados */
.backdrop-blur-sm {
    backdrop-filter: blur(12px);
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

/* Estilos para el botón de acción */
button {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

button:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
}

.custom-icon-size {
    font-size: 3rem !important;
    width: 3rem !important;
    height: 3rem !important;
}

/* O también puedes probar con: */
</style>