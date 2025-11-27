<template>
    <!-- Botón flotante mejorado para abrir el panel de música -->
    <button v-if="!showMusicPanel" @click="toggleMusicPanel"
        class="cursor-pointer fixed bottom-6 right-6 z-50 w-16 h-16 bg-linear-to-br from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 group music-button-float">
        
        <!-- Efectos de onda pulsantes alrededor del botón - CUANDO ESTÁ REPRODUCIENDO -->
        <div v-if="isPlaying && currentTrack" class="absolute -inset-4 border-2 border-cyan-400/30 rounded-full animate-ping-slow"></div>
        <div v-if="isPlaying && currentTrack" class="absolute -inset-6 border-2 border-cyan-400/20 rounded-full animate-ping-slow" style="animation-delay: 0.5s"></div>
        <div v-if="isPlaying && currentTrack" class="absolute -inset-8 border-2 border-cyan-400/10 rounded-full animate-ping-slow" style="animation-delay: 1s"></div>
        
        <!-- Efectos de onda pulsantes alrededor del botón - CUANDO ESTÁ EN PAUSA -->
        <div v-if="!isPlaying && currentTrack" class="absolute -inset-4 border-2 border-blue-400/20 rounded-full animate-ping-slow"></div>
        <div v-if="!isPlaying && currentTrack" class="absolute -inset-6 border-2 border-blue-400/15 rounded-full animate-ping-slow" style="animation-delay: 0.5s"></div>
        <div v-if="!isPlaying && currentTrack" class="absolute -inset-8 border-2 border-blue-400/10 rounded-full animate-ping-slow" style="animation-delay: 1s"></div>
        
        <!-- Efecto de pulso sutil de fondo -->
        <div class="absolute inset-0 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 opacity-20 animate-pulse-slow"></div>
        
        <!-- ESTADO: REPRODUCIENDO - Ondas de sonido mejoradas -->
        <div v-if="isPlaying && currentTrack" class="flex space-x-1 relative z-10">
            <div class="w-1.5 h-4 bg-white rounded-full animate-wave" style="animation-delay: 0ms"></div>
            <div class="w-1.5 h-4 bg-white rounded-full animate-wave" style="animation-delay: 150ms"></div>
            <div class="w-1.5 h-4 bg-white rounded-full animate-wave" style="animation-delay: 300ms"></div>
            <div class="w-1.5 h-4 bg-white rounded-full animate-wave" style="animation-delay: 450ms"></div>
        </div>
        
        <!-- ESTADO: PAUSADO CON CANCIÓN - Icono play -->
        <div v-else-if="!isPlaying && currentTrack" class="relative z-10">
            <i class="bi bi-play-circle-fill text-white text-xl transition-all duration-300 group-hover:scale-110"></i>
        </div>
        
        <!-- ESTADO: SIN CANCIÓN - Icono musical con efecto sutil -->
        <div v-else class="relative z-10">
            <i class="bi bi-play-circle-fill text-white text-xl transition-all duration-300 group-hover:scale-110"></i>
            <div class="absolute -inset-1 bg-white/20 rounded-full animate-ping-slow opacity-50"></div>
        </div>
        
        <!-- Indicador de notificación cuando hay una canción cargada -->
        <span v-if="currentTrack && !isPlaying"
            class="absolute -top-1 -right-1 w-4 h-4 bg-linear-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse border border-white z-20"></span>
            
        <!-- Efecto de brillo al hacer hover -->
        <div class="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    </button>

    <!-- Panel de música flotante mejorado -->
    <div v-if="showMusicPanel"
        class="fixed bottom-6 right-6 z-50 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl animate-slide-in-up border border-slate-700/50 music-panel-glow">
        <!-- Efecto de borde sutil -->
        <div class="absolute inset-0 rounded-2xl bg-linear-to-br from-cyan-500/10 to-blue-500/5 pointer-events-none"></div>
        
        <!-- Header del panel con efecto de vidrio mejorado -->
        <div class="flex justify-between items-center p-4 border-b border-slate-700/50 relative z-10">
            <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <h2 class="text-lg font-semibold text-cyan-100 drop-shadow-sm">Reproductor</h2>
            </div>
            <button @click="hideMusicPanel"
                class="w-8 h-8 rounded-full hover:bg-slate-700/50 flex items-center justify-center transition-all duration-300 text-cyan-100 hover:text-white hover:rotate-90">
                <i class="pi pi-times text-sm"></i>
            </button>
        </div>

        <!-- Información de la canción actual -->
        <div class="p-4 relative z-10">
            <div class="flex items-center space-x-4">
                <div class="relative">
                    <!-- Portada de álbum con efecto de rotación y sombra -->
                    <div class="relative rounded-xl overflow-hidden shadow-lg album-cover-glow">
                        <img :src="currentTrack?.cover || '/default-cover.jpg'" :alt="currentTrack?.title"
                            class="w-16 h-16 object-cover transition-all duration-500"
                            :class="{ 'animate-spin-slow': isPlaying }" />
                        <div v-if="!currentTrack"
                            class="w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <i class="pi pi-music text-white text-lg"></i>
                        </div>
                        <!-- Superposición de efecto de vinilo -->
                        <div v-if="currentTrack && isPlaying" class="absolute inset-0 rounded-full border-8 border-slate-900/30 pointer-events-none"></div>
                    </div>
                    <!-- Efecto de onda que se expande desde la portada -->
                    <div v-if="isPlaying && currentTrack" class="absolute -inset-2 border-2 border-cyan-400/30 rounded-xl animate-ping-slow pointer-events-none"></div>
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-medium truncate text-cyan-50 drop-shadow-sm transition-all duration-300"
                        :class="{ 'animate-text-pulse': isPlaying }">
                        {{ currentTrack?.title || 'Selecciona una canción' }}
                    </h3>
                    <p class="text-sm text-cyan-200/70 truncate mt-1">
                        {{ currentTrack?.artist || 'Artista' }}
                    </p>
                </div>
            </div>

            <!-- Barra de progreso mejorada -->
            <div class="mt-4">
                <div class="flex justify-between text-xs text-cyan-200/60 mb-2">
                    <span>{{ formatTime(currentTime) }}</span>
                    <span>{{ formatTime(currentTrack?.duration || 0) }}</span>
                </div>
                <div class="relative">
                    <div class="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                        <div class="h-full bg-linear-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-100" 
                             :style="{ width: `${(currentTime / (currentTrack?.duration || 1)) * 100}%` }">
                            <div class="absolute inset-0 bg-linear-to-r from-transparent to-white/30 rounded-full animate-shimmer"></div>
                        </div>
                    </div>
                    <input type="range" :value="currentTime" :max="currentTrack?.duration || 0"
                        @input="seekTo(($event.target as HTMLInputElement).valueAsNumber)" 
                        class="music-progress absolute inset-0 w-full h-3 opacity-0 cursor-pointer" />
                </div>
            </div>

            <!-- Controles principales mejorados -->
            <div class="flex items-center justify-center gap-4 mt-6">
                <!-- Botón de repetición -->
                <div class="relative group/tooltip">
                    <button @click="toggleRepeat"
                        class="w-9 h-9 rounded-full hover:bg-slate-700/50 flex items-center justify-center transition-all duration-300 group control-button"
                        :class="{
                            'text-cyan-400 bg-cyan-400/10': repeatMode !== 'none',
                            'text-cyan-200/60': repeatMode === 'none'
                        }">
                        <i class="text-sm transition-all duration-300 group-hover:scale-110" :class="{
                            'bi bi-arrow-repeat': repeatMode === 'all',
                            'bi bi-arrow-clockwise': repeatMode === 'one',
                            'pi pi-replay text-cyan-200/60': repeatMode === 'none'
                        }"></i>
                    </button>
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-cyan-100 text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-lg border border-slate-700/50">
                        {{
                            repeatMode === 'none' ? 'Repetición desactivada' :
                                repeatMode === 'one' ? 'Repetir una canción' :
                                    'Repetir toda la lista'
                        }}
                    </div>
                </div>

                <!-- Botón anterior -->
                <div class="relative group/tooltip">
                    <button @click="playPreviousTrack"
                        class="w-10 h-10 rounded-full hover:bg-slate-700/50 flex items-center justify-center transition-all duration-300 text-cyan-100 hover:text-white group control-button"
                        :disabled="!currentTrack && trackHistory.length === 0">
                        <i class="pi pi-step-backward group-hover:scale-110 transition-transform duration-300"></i>
                    </button>
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-cyan-100 text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-lg border border-slate-700/50">
                        Canción anterior
                    </div>
                </div>

                <!-- Botón play/pause principal -->
                <div class="relative group/tooltip">
                    <button @click="togglePlayback"
                        class="w-12 h-12 bg-linear-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg control-button-main">
                        <i class="text-white text-lg transition-all duration-300"
                            :class="isPlaying ? 'pi pi-pause' : 'pi pi-play'"></i>
                        <!-- Efecto de pulso en el botón de reproducción -->
                        <div v-if="isPlaying" class="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping-slow"></div>
                    </button>
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-cyan-100 text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-lg border border-slate-700/50">
                        {{ isPlaying ? 'Pausar' : 'Reproducir' }}
                    </div>
                </div>

                <!-- Botón siguiente -->
                <div class="relative group/tooltip">
                    <button @click="playNextTrack"
                        class="w-10 h-10 rounded-full hover:bg-slate-700/50 flex items-center justify-center transition-all duration-300 text-cyan-100 hover:text-white group control-button"
                        :disabled="!currentTrack">
                        <i class="pi pi-step-forward group-hover:scale-110 transition-transform duration-300"></i>
                    </button>
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-cyan-100 text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-lg border border-slate-700/50">
                        Siguiente canción
                    </div>
                </div>

                <!-- Botón shuffle -->
                <div class="relative group/tooltip">
                    <button @click="toggleShuffle"
                        class="w-9 h-9 rounded-full hover:bg-slate-700/50 flex items-center justify-center transition-all duration-300 group control-button"
                        :class="{
                            'text-cyan-400 bg-cyan-400/10': isShuffled,
                            'text-cyan-200/60': !isShuffled
                        }">
                        <i class="bi bi-shuffle text-sm group-hover:scale-110 transition-transform duration-300"></i>
                    </button>
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-cyan-100 text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-lg border border-slate-700/50">
                        {{ isShuffled ? 'Modo aleatorio activado' : 'Modo aleatorio desactivado' }}
                    </div>
                </div>
            </div>

            <!-- Control de volumen mejorado -->
            <div class="flex items-center space-x-3 mt-4">
                <i class="pi pi-volume-up text-cyan-200/60 text-sm"></i>
                <div class="relative flex-1">
                    <div class="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                        <div class="h-full bg-linear-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300" 
                             :style="{ width: `${volume * 100}%` }"></div>
                    </div>
                    <input type="range" :value="volume" min="0" max="1" step="0.01"
                        @input="adjustVolume(($event.target as HTMLInputElement).value)" 
                        class="volume-slider absolute inset-0 w-full h-3 opacity-0 cursor-pointer" />
                </div>
                <span class="text-xs text-cyan-200/60 w-10">
                    {{ Math.round(volume * 100) }}%
                </span>
            </div>
        </div>

        <!-- Lista de canciones mejorada -->
        <div class="border-t border-slate-700/50 max-h-60 overflow-y-auto scrollbar-hide relative z-10">
            <div class="p-2">
                <div class="flex justify-between items-center mb-3 px-2">
                    <h3 class="font-medium text-sm text-cyan-100 flex items-center">
                        <i class="pi pi-list mr-2 text-cyan-400"></i>
                        Lista de reproducción
                    </h3>
                    <button @click="playRandomTrack"
                        class="text-xs text-cyan-200/60 hover:text-cyan-400 transition-all duration-300 flex items-center gap-1 group">
                        <i class="pi pi-random text-xs group-hover:rotate-180 transition-transform duration-500"></i>
                        Aleatorio
                    </button>
                </div>

                <!-- Canciones con efectos mejorados -->
                <div v-for="(track, index) in tracks" :key="track.id" @click="playTrack(track)"
                    class="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 cursor-pointer transition-all duration-300 group animate-slide-up border border-transparent hover:border-slate-600/30 music-track-item"
                    :class="{
                        'bg-cyan-500/10 border-cyan-400/30 shadow-md': currentTrack?.id === track.id,
                        'hover:shadow-lg': currentTrack?.id !== track.id
                    }"
                    :style="{'animation-delay': `${index * 50}ms`}">
                    <div class="relative">
                        <div class="rounded-lg overflow-hidden shadow-sm album-cover-glow-sm">
                            <img :src="track.cover || '/default-cover.jpg'" :alt="track.title"
                                class="w-10 h-10 object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div v-if="currentTrack?.id === track.id && isPlaying"
                            class="absolute inset-0 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                            <div class="flex space-x-1">
                                <div class="w-1 h-3 bg-cyan-400 rounded-full animate-wave" style="animation-delay: 0ms"></div>
                                <div class="w-1 h-3 bg-cyan-400 rounded-full animate-wave" style="animation-delay: 150ms"></div>
                                <div class="w-1 h-3 bg-cyan-400 rounded-full animate-wave" style="animation-delay: 300ms"></div>
                            </div>
                        </div>
                        <div v-else-if="currentTrack?.id === track.id"
                            class="absolute inset-0 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                            <i class="pi pi-play text-cyan-400 text-xs"></i>
                        </div>
                        <!-- Número de pista con efecto sutil -->
                        <div v-if="currentTrack?.id !== track.id" 
                             class="absolute -left-1 -top-1 w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center text-xs text-cyan-200/70 group-hover:bg-cyan-500/20 transition-colors duration-300">
                            {{ index + 1 }}
                        </div>
                    </div>

                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate transition-all duration-300" :class="{
                            'text-cyan-400': currentTrack?.id === track.id,
                            'text-cyan-100 group-hover:text-white': currentTrack?.id !== track.id
                        }">
                            {{ track.title }}
                        </p>
                        <p class="text-xs text-cyan-200/70 truncate mt-0.5">{{ track.artist }}</p>
                    </div>

                    <div class="flex items-center space-x-2">
                        <span class="text-xs text-cyan-200/60">
                            {{ formatTime(track.duration) }}
                        </span>
                        <button @click.stop="addToQueue(track)"
                            class="w-6 h-6 opacity-0 group-hover:opacity-100 hover:bg-cyan-500/20 rounded flex items-center justify-center transition-all duration-300 text-cyan-200/70 hover:text-cyan-400 hover:scale-110"
                            title="Añadir a la cola">
                            <i class="pi pi-plus text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cola de reproducción mejorada -->
        <div v-if="trackQueue.length > 0" class="border-t border-slate-700/50 p-4 relative z-10">
            <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium text-sm text-cyan-100 flex items-center">
                    <i class="pi pi-clock mr-2 text-cyan-400"></i>
                    Siguiente en cola
                </h3>
                <button @click="clearQueue" class="text-xs text-cyan-200/60 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1">
                    <i class="pi pi-trash text-xs"></i>
                    Limpiar
                </button>
            </div>
            <div class="space-y-2 max-h-32 overflow-y-auto scrollbar-hide">
                <div v-for="(track, index) in trackQueue" :key="track.id"
                    class="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-700/30 text-sm transition-all duration-300 group border border-transparent hover:border-slate-600/30 queue-item">
                    <span class="text-xs text-cyan-200/60 w-4 flex items-center justify-center">{{ index + 1 }}</span>
                    <img :src="track.cover || '/default-cover.jpg'" :alt="track.title"
                        class="w-8 h-8 rounded-lg object-cover border border-slate-600/50 shadow-sm transition-transform duration-300 group-hover:scale-105" />
                    <div class="flex-1 min-w-0">
                        <p class="truncate text-cyan-100">{{ track.title }}</p>
                        <p class="text-xs text-cyan-200/70 truncate">{{ track.artist }}</p>
                    </div>
                    <button @click="removeFromQueue(track.id)"
                        class="w-6 h-6 opacity-0 group-hover:opacity-100 hover:bg-cyan-500/20 rounded flex items-center justify-center transition-all duration-300 text-cyan-200/60 hover:text-cyan-400 hover:scale-110">
                        <i class="pi pi-times text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMusicStore } from '@/stores/general/musicStore'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'

// Store de música
const musicStore = useMusicStore()

// Estado local para loading
const isLoading = ref(true)

// Destructurar el store
const {
    isPlaying,
    currentTrack,
    currentTime,
    trackHistory,
    trackQueue,
    showMusicPanel,
    volume,
    isShuffled,
    repeatMode,
    tracks
} = storeToRefs(musicStore)

// Métodos del store
const {
    togglePlayback,
    playNextTrack,
    playPreviousTrack,
    toggleShuffle,
    toggleRepeat,
    seekTo,
    adjustVolume,
    toggleMusicPanel,
    hideMusicPanel,
    addToQueue,
    removeFromQueue,
    clearQueue,
    playTrack,
    initAudioPlayer,
    activateAudioGlobally,
    playRandomTrack,
    loadTracks,
    initializeAllDurations
} = musicStore

// Formatear tiempo (segundos a MM:SS)
const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00'

    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Listeners globales para activar audio
const setupGlobalListeners = () => {
    document.addEventListener('click', handleGlobalClick)
    document.addEventListener('keydown', handleGlobalClick)
    document.addEventListener('touchstart', handleGlobalClick)
}

const removeGlobalListeners = () => {
    document.removeEventListener('click', handleGlobalClick)
    document.removeEventListener('keydown', handleGlobalClick)
    document.removeEventListener('touchstart', handleGlobalClick)
}

const handleGlobalClick = () => {
    activateAudioGlobally()
}

// Inicialización
onMounted(async () => {
    console.log('🎵 Montando MusicPlayer...')
    
    try {
        // 1. Inicializar reproductor
        initAudioPlayer()
        
        // 2. Cargar tracks
        console.log('🔄 Cargando tracks...')
        await loadTracks()
        console.log('✅ Tracks cargados:', tracks.value.length)
        
        // 3. Inicializar duraciones
        console.log('🔄 Inicializando duraciones...')
        await initializeAllDurations()
        console.log('✅ Duraciones inicializadas')
        
        isLoading.value = false
        
        // 4. Configurar listeners
        setTimeout(() => {
            setupGlobalListeners()
        }, 1000)
        
    } catch (error) {
        console.error('❌ Error inicializando reproductor:', error)
        isLoading.value = false
    }
})

onUnmounted(() => {
    removeGlobalListeners()
})
</script>

<style scoped>
/* Efectos de vidrio mejorados */
.glass-effect {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(148, 163, 184, 0.2);
}

.music-panel-glow {
    box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(148, 163, 184, 0.1),
        0 0 40px rgba(34, 211, 238, 0.1);
}

.album-cover-glow {
    box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(34, 211, 238, 0.2),
        0 0 20px rgba(34, 211, 238, 0.1);
}

.album-cover-glow-sm {
    box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(34, 211, 238, 0.1);
}

/* Botón flotante mejorado */
.music-button-float {
    box-shadow: 
        0 4px 14px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(34, 211, 238, 0.2),
        0 0 20px rgba(34, 211, 238, 0.2);
}

/* Barras de progreso mejoradas */
.music-progress {
    -webkit-appearance: none;
    appearance: none;
    height: 12px;
    border-radius: 10px;
    background: transparent;
    outline: none;
    transition: all 0.2s ease;
}

.music-progress::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #22d3ee;
    cursor: pointer;
    box-shadow: 
        0 0 0 2px rgba(15, 23, 42, 0.9),
        0 0 10px rgba(34, 211, 238, 0.8);
    transition: all 0.2s ease;
    border: 2px solid white;
}

.music-progress::-webkit-slider-thumb:hover {
    background: #06b6d4;
    transform: scale(1.2);
    box-shadow: 
        0 0 0 2px rgba(15, 23, 42, 0.9),
        0 0 15px rgba(34, 211, 238, 1);
}

.volume-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 12px;
    border-radius: 10px;
    background: transparent;
    outline: none;
    transition: all 0.2s ease;
}

.volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #22d3ee;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid white;
    box-shadow: 0 0 5px rgba(34, 211, 238, 0.8);
}

.volume-slider::-webkit-slider-thumb:hover {
    background: #06b6d4;
    transform: scale(1.2);
    box-shadow: 0 0 8px rgba(34, 211, 238, 1);
}

/* Ocultar scrollbar */
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Animaciones mejoradas */
.animate-spin-slow {
    animation: spin 8s linear infinite;
}

.animate-spin-slow-reverse {
    animation: spin-reverse 10s linear infinite;
}

.animate-wave {
    animation: wave 1.5s ease-in-out infinite;
}

.animate-pulse-slow {
    animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping-slow {
    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-slide-in-up {
    animation: slideInUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.animate-text-pulse {
    animation: textPulse 3s ease-in-out infinite;
}

.animate-shimmer {
    animation: shimmer 2s infinite;
    width: 50%; /* Limita el ancho del efecto */
    left: 0; /* Asegura que empiece desde la izquierda */
}

.animate-slide-up {
    animation: slideUp 0.5s ease-out both;
}

/* Efectos para elementos interactivos */
.control-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.control-button:hover {
    transform: translateY(-2px);
}

.control-button-main {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 14px rgba(34, 211, 238, 0.3);
}

.control-button-main:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(34, 211, 238, 0.4);
}

.music-track-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.music-track-item:hover {
    transform: translateX(4px);
}

.queue-item {
    transition: all 0.3s ease;
}

.queue-item:hover {
    transform: translateX(2px);
}

/* Keyframes para animaciones */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes spin-reverse {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0deg);
    }
}

@keyframes wave {
    0%, 100% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(2.5);
    }
}

@keyframes pulse-slow {
    0%, 100% {
        opacity: 0.2;
    }
    50% {
        opacity: 0.5;
    }
}

@keyframes ping-slow {
    0% {
        transform: scale(1);
        opacity: 0.7;
    }
    75%, 100% {
        transform: scale(2);
        opacity: 0;
    }
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes textPulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.02);
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(200%);
    }
}

@keyframes slideUp {
    from {
        transform: translateY(10px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>