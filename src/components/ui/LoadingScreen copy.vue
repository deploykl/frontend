<template>
    <transition name="fade" @after-leave="handleAnimationComplete">
        <div v-if="internalShow" class="fixed inset-0 z-9999 flex items-center justify-center bg-linear-to-br from-slate-900 to-indigo-900">
            <!-- Canvas para el efecto Matrix -->
            <canvas 
                ref="matrixCanvas" 
                class="absolute inset-0 w-full h-full pointer-events-none"
                :style="{ opacity: 0.7 }"
            ></canvas>

            <!-- Fondo animado MEJORADO -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
                <div class="absolute top-1/4 left-1/4 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 4s;"></div>
            </div>

            <!-- Contenido principal -->
            <div class="relative z-10 text-center text-white space-y-8">
                <!-- Logo animado -->
                <div class="relative mx-auto w-32 h-32">
                    <div class="absolute inset-0 bg-blue-400/20 rounded-3xl transform rotate-45 animate-ping-slow"></div>
                    <div class="absolute inset-2 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <i class="bi bi-shield-check text-blue-300 text-4xl animate-pulse"></i>
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
                    <div class="flex items-center justify-center space-x-2 animate-fade-in-stagger" style="animation-delay: 0.5s;">
                        <i class="pi pi-cog animate-spin text-blue-300 text-base"></i>
                        <span>Cargando módulos del sistema</span>
                    </div>
                    <div class="flex items-center justify-center space-x-2 animate-fade-in-stagger" style="animation-delay: 1s;">
                        <i class="pi pi-database text-cyan-400 text-base"></i>
                        <span>Conectando con base de datos</span>
                    </div>
                    <div class="flex items-center justify-center space-x-2 animate-fade-in-stagger" style="animation-delay: 1.5s;">
                        <i class="pi pi-lock text-amber-400 text-base"></i>
                        <span>Estableciendo conexión segura</span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed, onMounted, nextTick } from 'vue'

interface Props {
    show: boolean
    duration?: number
}

const props = withDefaults(defineProps<Props>(), {
    duration: 6000
})

const emit = defineEmits<{
    complete: []
}>()

const countdown = ref(Math.ceil(props.duration / 1000))
const internalShow = ref(false)
const elapsedTime = ref(0)
const matrixCanvas = ref<HTMLCanvasElement | null>(null)

// Variables para el efecto Matrix
let matrixInterval: number | null = null
let columns: number[] = []
let countdownInterval: number | null = null
let startTime: number = 0

// Progress bar sincronizada con el tiempo real
const progressWidth = computed(() => {
    if (props.duration === 0) return 0
    return Math.min((elapsedTime.value / props.duration) * 100, 100)
})

// Función del efecto Matrix
const initializeMatrix = () => {
    if (!matrixCanvas.value) return
    
    const canvas = matrixCanvas.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar canvas para pantalla completa
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    // Configurar estilo del texto
    ctx.font = '14px "Courier New", monospace'
    ctx.textBaseline = 'top'

    // Inicializar columnas
    columns = []
    for (let i = 0; i < 256; i++) {
        columns[i] = 1
    }

    // Limpiar intervalo anterior si existe
    if (matrixInterval) {
        clearInterval(matrixInterval)
    }

    // Ejecutar efecto Matrix
    matrixInterval = window.setInterval(() => {
        if (!ctx) return

        // Oscurecer ligeramente el canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Color azul cyan para el texto (en lugar del verde original)
        ctx.fillStyle = '#00ffff'
        
        // Para cada columna
        columns.forEach((value, index) => {
            // Carácter aleatorio en el rango de ideogramas CJK
            const character = String.fromCharCode(
                0x30A0 + Math.random() * 96 // Rango diferente para más variedad
            )
            
            // Dibujar el carácter
            ctx.fillText(
                character, // texto
                index * 10, // x
                value // y
            )
            
            // Desplazar hacia abajo el carácter
            // Resetear aleatoriamente cuando llega al fondo
            columns[index] = value > 758 + Math.random() * 1e4 ? 0 : value + 10
        })
    }, 33) // ~30 fps
}

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
    // Limpiar intervalos
    if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
    }
    if (matrixInterval) {
        clearInterval(matrixInterval)
        matrixInterval = null
    }
    elapsedTime.value = 0
}

// Observar cambios en la prop show
watch(() => props.show, (newVal) => {
    console.log('🔍 Prop show cambió:', newVal)
    if (newVal) {
        internalShow.value = true
        countdown.value = Math.ceil(props.duration / 1000)
        
        // Inicializar Matrix después de que el DOM se actualice
        nextTick(() => {
            setTimeout(() => {
                initializeMatrix()
                startCountdown()
            }, 100)
        })
    } else {
        internalShow.value = false
        cleanup()
    }
}, { immediate: true })

// Manejar resize de ventana
const handleResize = () => {
    if (internalShow.value && matrixCanvas.value) {
        initializeMatrix()
    }
}

onMounted(() => {
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    cleanup()
    window.removeEventListener('resize', handleResize)
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
    0%, 100% {
        transform: scale(1) rotate(45deg);
        opacity: 1;
    }
    50% {
        transform: scale(1.2) rotate(45deg);
        opacity: 0.5;
    }
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