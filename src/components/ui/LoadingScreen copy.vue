<template>
    <transition name="fade" @after-leave="handleAnimationComplete">
        <div v-if="internalShow"
            class="fixed inset-0 z-9999 flex items-center justify-center bg-linear-to-br from-slate-900 to-indigo-900">
            <!-- Fondo animado MEJORADO -->
            <div class="absolute inset-0 overflow-hidden">
                <div
                    class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow">
                </div>
                <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"
                    style="animation-delay: 2s;"></div>
                <div class="absolute top-1/4 left-1/4 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow"
                    style="animation-delay: 4s;"></div>
            </div>

            <!-- EFECTO MATRIX - Partículas cayendo como código -->
            <div class="absolute inset-0 pointer-events-none overflow-hidden matrix-container">
                <div v-for="(column, colIndex) in matrixColumns" :key="colIndex" class="absolute matrix-column"
                    :style="{ left: `${column.position}%` }">
                    <div v-for="particle in column.particles" :key="particle.id"
                        class="matrix-character text-green-400 font-mono text-xs opacity-80 absolute" :style="{
                            top: `${particle.position}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.speed}s`
                        }">
                        {{ particle.char }}
                    </div>
                </div>
            </div>

            <!-- Contenido principal -->
            <div class="relative z-10 text-center text-white space-y-8">
                <!-- Logo animado -->
                <div class="relative mx-auto w-32 h-32">
                    <div class="absolute inset-0 bg-blue-400/20 rounded-3xl transform rotate-45 animate-ping-slow">
                    </div>
                    <div
                        class="absolute inset-2 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <i class="pi pi-shield text-blue-300 text-4xl animate-pulse"></i>
                    </div>
                </div>

                <!-- Texto principal -->
                <div class="space-y-4">
                    <h1 class="text-4xl md:text-5xl font-black tracking-tight animate-bounce-in">
                        INGRESANDO AL SISTEMA
                    </h1>
                    <p class="text-xl text-blue-200 font-light animate-fade-in-delay">
                        Preparando tu experiencia personalizada
                    </p>
                </div>

                <!-- Indicador de progreso -->
                <div class="w-64 mx-auto space-y-4">
                    <!-- Barra de progreso -->
                    <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-linear-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-100 ease-linear"
                            :style="{ width: progressWidth + '%' }"></div>
                    </div>

                    <!-- Contador -->
                    <div class="flex justify-between items-center text-sm text-blue-200">
                        <span>Inicializando...</span>
                        <span class="font-mono font-bold text-cyan-300">{{ countdown }}s</span>
                    </div>
                </div>

                <!-- Mensajes de estado -->
                <div class="space-y-2 text-blue-200 text-sm">
                    <div class="flex items-center justify-center space-x-2 animate-fade-in-stagger">
                        <i class="pi pi-check-circle text-green-400 text-base"></i>
                        <span>Credenciales verificadas</span>
                    </div>
                    <div class="flex items-center justify-center space-x-2 animate-fade-in-stagger"
                        style="animation-delay: 0.5s;">
                        <i class="pi pi-cog animate-spin text-blue-300 text-base"></i>
                        <span>Cargando módulos del sistema</span>
                    </div>
                    <div class="flex items-center justify-center space-x-2 animate-fade-in-stagger"
                        style="animation-delay: 1s;">
                        <i class="pi pi-database text-cyan-400 text-base"></i>
                        <span>Conectando con base de datos</span>
                    </div>
                    <div class="flex items-center justify-center space-x-2 animate-fade-in-stagger"
                        style="animation-delay: 1.5s;">
                        <i class="pi pi-lock text-amber-400 text-base"></i>
                        <span>Estableciendo conexión segura</span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed, onMounted } from 'vue'

interface Props {
    show: boolean
    duration?: number
}

const props = withDefaults(defineProps<Props>(), {
    duration: 5000
})

const emit = defineEmits<{
    complete: []
}>()

const countdown = ref(Math.ceil(props.duration / 1000))
const internalShow = ref(false)
const elapsedTime = ref(0)

// Sistema Matrix
const matrixColumns = ref<Array<{
    position: number
    particles: Array<{
        id: number
        position: number
        delay: number
        speed: number
        char: string
    }>
}>>([])

// Caracteres para el efecto Matrix (código binario y símbolos)
const matrixChars = ['0', '1', '⎨', '⎬', '⎫', '⎭', '⌇', '‖', '│', '║', '▌', '▐', '░', '▒', '▓']

const initializeMatrix = () => {
    const columns = []
    const columnCount = 30 // Número de columnas de código

    for (let i = 0; i < columnCount; i++) {
        const particles = []
        const particleCount = 15 + Math.floor(Math.random() * 10) // Partículas por columna

        for (let j = 0; j < particleCount; j++) {
            particles.push({
                id: i * 100 + j,
                position: -20 - (j * 8), // Comienzan arriba y espaciadas
                delay: Math.random() * 5, // Delay aleatorio
                speed: 3 + Math.random() * 4, // Velocidad variable
                char: matrixChars[Math.floor(Math.random() * matrixChars.length)] as string
            })
        }

        columns.push({
            position: (i / columnCount) * 100,
            particles
        })
    }

    matrixColumns.value = columns
}

let countdownInterval: number | null = null
let startTime: number = 0

// Progress bar sincronizada con el tiempo real
const progressWidth = computed(() => {
    if (props.duration === 0) return 0
    return Math.min((elapsedTime.value / props.duration) * 100, 100)
})

const startCountdown = () => {
    console.log('🚀 LoadingScreen iniciando countdown...', props.duration, 'ms')
    startTime = Date.now()
    elapsedTime.value = 0

    countdownInterval = window.setInterval(() => {
        const currentTime = Date.now()
        elapsedTime.value = currentTime - startTime
        countdown.value = Math.ceil((props.duration - elapsedTime.value) / 1000)

        if (elapsedTime.value >= props.duration) {
            console.log('✅ Countdown completado, cerrando LoadingScreen...')
            cleanup()
            internalShow.value = false
        }
    }, 50)
}

const handleAnimationComplete = () => {
    console.log('🎯 Transición completada, emitiendo evento complete')
    emit('complete')
}

const cleanup = () => {
    if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
    }
    elapsedTime.value = 0
}

// Observar cambios en la prop show
watch(() => props.show, (newVal) => {
    console.log('🔍 Prop show cambió:', newVal)
    if (newVal) {
        internalShow.value = true
        countdown.value = Math.ceil(props.duration / 1000)
        // Inicializar efecto Matrix
        initializeMatrix()
        // Pequeño delay para asegurar que la animación se renderice
        setTimeout(() => {
            startCountdown()
        }, 100)
    } else {
        internalShow.value = false
        cleanup()
    }
}, { immediate: true })

onMounted(() => {
    // Inicializar Matrix por si acaso
    initializeMatrix()
})

onUnmounted(() => {
    cleanup()
})
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes bounce-in {
    0% {
        opacity: 0;
        transform: scale(0.3) translateY(100px);
    }

    50% {
        opacity: 1;
        transform: scale(1.05) translateY(-10px);
    }

    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@keyframes ping-slow {

    0%,
    100% {
        transform: scale(1) rotate(45deg);
        opacity: 1;
    }

    50% {
        transform: scale(1.2) rotate(45deg);
        opacity: 0.5;
    }
}

/* EFECTO MATRIX - Código cayendo */
@keyframes matrix-fall {
    0% {
        transform: translateY(-100px);
        opacity: 0;
        text-shadow: 0 0 8px #00ffff, 0 0 16px #00ffff;
    }

    5% {
        opacity: 1;
        text-shadow: 0 0 8px #00ffff, 0 0 16px #00ffff, 0 0 24px #00ffff;
    }

    90% {
        opacity: 0.7;
        text-shadow: 0 0 4px #00ffff, 0 0 8px #00ffff;
    }

    100% {
        transform: translateY(100vh);
        opacity: 0;
        text-shadow: 0 0 2px #00ffff;
    }
}

/* Efecto de brillo para los caracteres del Matrix */
@keyframes matrix-glow {

    0%,
    100% {
        opacity: 0.4;
        text-shadow: 0 0 4px #00ffff;
    }

    50% {
        opacity: 1;
        text-shadow: 0 0 8px #00ffff, 0 0 16px #00ffff, 0 0 20px #00ffff;
    }
}

.matrix-container {
    background: linear-gradient(to bottom,
            transparent 0%,
            rgba(0, 50, 100, 0.1) 20%,
            rgba(0, 80, 160, 0.2) 50%,
            rgba(0, 50, 100, 0.1) 80%,
            transparent 100%);
}

.matrix-column {
    animation: matrix-glow 3s ease-in-out infinite;
}

.matrix-character {
    animation: matrix-fall linear infinite;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    color: #00ffff;
    text-shadow: 0 0 8px #00ffff;
    will-change: transform, opacity;
}

/* Efecto de desvanecimiento suave para las columnas */
.matrix-column:nth-child(odd) .matrix-character {
    color: #00b3b3;
    text-shadow: 0 0 6px #00b3b3;
}

.matrix-column:nth-child(3n) .matrix-character {
    color: #008080;
    text-shadow: 0 0 4px #008080;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fade-in-stagger {
    0% {
        opacity: 0;
        transform: translateX(-20px);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Clases de animación */
.animate-bounce-in {
    animation: bounce-in 1s ease-out;
}

.animate-ping-slow {
    animation: ping-slow 2s ease-in-out infinite;
}

.animate-fade-in-delay {
    animation: fade-in 0.8s ease-out 0.3s both;
}

.animate-fade-in-stagger {
    animation: fade-in-stagger 0.6s ease-out both;
}

/* Transición de desvanecimiento */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(1.1);
}
</style>