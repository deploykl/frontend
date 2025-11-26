<template>
    <!-- Botón flotante para abrir el panel de música -->
    <button v-if="!showMusicPanel" @click="toggleMusicPanel"
        class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-linear-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
        <i class="pi pi-play text-white text-xl"></i>
        <span v-if="currentTrack"
            class="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full animate-pulse"></span>
    </button>

    <!-- Panel de música flotante -->
    <div v-if="showMusicPanel"
        class="fixed bottom-6 right-6 z-50 w-80 bg-slate-900/95 glass-effect rounded-2xl shadow-2xl animate-fade-in border border-slate-700/50">
        <!-- Header del panel -->
        <div class="flex justify-between items-center p-4 border-b border-slate-700/50">
            <h2 class="text-lg font-semibold text-cyan-100">Reproductor</h2>
            <button @click="hideMusicPanel"
                class="w-8 h-8 rounded-full hover:bg-slate-700/50 flex items-center justify-center transition-colors text-cyan-100 hover:text-white">
                <i class="pi pi-times"></i>
            </button>
        </div>

        <!-- Información de la canción actual -->
        <div class="p-4">
            <div class="flex items-center space-x-4">
                <div class="relative">
                    <img :src="currentTrack?.cover || '/default-cover.jpg'" :alt="currentTrack?.title"
                        class="w-16 h-16 rounded-full object-cover shadow-lg border border-slate-600/50"
                        :class="{ 'animate-spin-slow': isPlaying }" />
                    <div v-if="!currentTrack"
                        class="w-16 h-16 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center border border-slate-600/50">
                        <i class="pi pi-music text-white text-lg"></i>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-medium truncate text-cyan-50">
                        {{ currentTrack?.title || 'Selecciona una canción' }}
                    </h3>
                    <p class="text-sm text-cyan-200/70 truncate">
                        {{ currentTrack?.artist || 'Artista' }}
                    </p>
                </div>
            </div>

            <!-- Barra de progreso -->
            <div class="mt-4">
                <div class="flex justify-between text-xs text-cyan-200/60 mb-1">
                    <span>{{ formatTime(currentTime) }}</span>
                    <span>{{ formatTime(currentTrack?.duration || 0) }}</span>
                </div>
                <input type="range" :value="currentTime" :max="currentTrack?.duration || 0"
                    @input="seekTo(($event.target as HTMLInputElement).valueAsNumber)" class="music-progress w-full" />
            </div>

            <!-- Controles principales -->
            <div class="flex items-center justify-center gap-4 mt-6">
                <!-- Botón de repetición -->
                <div class="relative group/tooltip">
                    <button @click="toggleRepeat"
                        class="w-8 h-8 rounded-full hover:bg-slate-700/50 flex items-center justify-center transition-colors group"
                        :class="{
                            'text-cyan-400': repeatMode !== 'none',
                            'text-cyan-200/60': repeatMode === 'none'
                        }">
                        <i class="text-xs transition-transform group-hover:scale-110" :class="{
                            'bi bi-arrow-repeat': repeatMode === 'all',
                            'bi bi-arrow-clockwise': repeatMode === 'one',
                            'bi bi-arrow-repeat text-cyan-200/60': repeatMode === 'none'
                        }"></i>
                    </button>
                    <div
                        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-cyan-100 text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
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
                        class="w-10 h-10 rounded-full hover:bg-slate-700/50 flex items-center justify-center transition-colors text-cyan-100 hover:text-white group"
                        :disabled="!currentTrack && trackHistory.length === 0">
                        <i class="bi bi-skip-start-fill group-hover:scale-110 transition-transform"></i>
                    </button>
                    <div
                        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-cyan-100 text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                        Canción anterior
                    </div>
                </div>

                <!-- Botón play/pause -->
                <div class="relative group/tooltip">
                    <button @click="togglePlayback"
                        class="w-12 h-12 bg-linear-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg">
                        <i class="text-white text-lg transition-transform"
                            :class="isPlaying ? 'bi bi-pause-circle-fill' : 'bi bi-play-circle-fill'"></i>
                    </button>
                    <div
                        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-cyan-100 text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                        {{ isPlaying ? 'Pausar' : 'Reproducir' }}
                    </div>
                </div>

                <!-- Botón siguiente -->
                <div class="relative group/tooltip">
                    <button @click="playNextTrack"
                        class="w-10 h-10 rounded-full hover:bg-slate-700/50 flex items-center justify-center transition-colors text-cyan-100 hover:text-white group"
                        :disabled="!currentTrack">
                        <i class="bi bi-skip-end-fill group-hover:scale-110 transition-transform"></i>
                    </button>
                    <div
                        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-cyan-100 text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                        Siguiente canción
                    </div>
                </div>

                <!-- Botón shuffle -->
                <div class="relative group/tooltip">
                    <button @click="toggleShuffle"
                        class="w-8 h-8 rounded-full hover:bg-slate-700/50 flex items-center justify-center transition-colors group"
                        :class="{
                            'text-cyan-400': isShuffled,
                            'text-cyan-200/60': !isShuffled
                        }">
                        <i class="bi bi-shuffle text-xs group-hover:scale-110 transition-transform"></i>
                    </button>
                    <div
                        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-cyan-100 text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                        {{ isShuffled ? 'Modo aleatorio activado' : 'Modo aleatorio desactivado' }}
                    </div>
                </div>
            </div>

            <!-- Control de volumen -->
            <div class="flex items-center space-x-3 mt-4">
                <i class="pi pi-volume-up text-cyan-200/60 text-sm"></i>
                <input type="range" :value="volume" min="0" max="1" step="0.01"
                    @input="adjustVolume(($event.target as HTMLInputElement).value)" class="volume-slider flex-1" />
                <span class="text-xs text-cyan-200/60 w-10">
                    {{ Math.round(volume * 100) }}%
                </span>
            </div>
        </div>

        <!-- Lista de canciones -->
        <div class="border-t border-slate-700/50 max-h-60 overflow-y-auto scrollbar-hide">
            <div class="p-2">
                <div class="flex justify-between items-center mb-3 px-2">
                    <h3 class="font-medium text-sm text-cyan-100">Lista de reproducción</h3>
                    <button @click="playRandomTrack"
                        class="text-xs text-cyan-200/60 hover:text-cyan-400 transition-colors flex items-center gap-1">
                        <i class="bi bi-shuffle text-xs"></i>
                        Aleatorio
                    </button>
                </div>

                <!-- Canciones -->
                <div v-for="track in tracks" :key="track.id" @click="playTrack(track)"
                    class="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 cursor-pointer transition-colors group animate-slide-up border border-transparent hover:border-slate-600/30"
                    :class="{
                        'bg-cyan-500/10 border-cyan-400/30': currentTrack?.id === track.id
                    }">
                    <div class="relative">
                        <img :src="track.cover || '/default-cover.jpg'" :alt="track.title"
                            class="w-10 h-10 rounded-lg object-cover border border-slate-600/50" />
                        <div v-if="currentTrack?.id === track.id && isPlaying"
                            class="absolute inset-0 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                            <div class="flex space-x-1">
                                <div class="w-1 h-3 bg-cyan-400 rounded-full animate-bounce-slow"></div>
                                <div class="w-1 h-3 bg-cyan-400 rounded-full animate-bounce-slow"
                                    style="animation-delay: 0.1s"></div>
                                <div class="w-1 h-3 bg-cyan-400 rounded-full animate-bounce-slow"
                                    style="animation-delay: 0.2s"></div>
                            </div>
                        </div>
                        <div v-else-if="currentTrack?.id === track.id"
                            class="absolute inset-0 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                            <i class="pi pi-play text-cyan-400 text-xs"></i>
                        </div>
                    </div>

                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate" :class="{
                            'text-cyan-400': currentTrack?.id === track.id,
                            'text-cyan-100': currentTrack?.id !== track.id
                        }">
                            {{ track.title }}
                        </p>
                        <p class="text-xs text-cyan-200/70 truncate">{{ track.artist }}</p>
                    </div>

                    <div class="flex items-center space-x-2">
                        <span class="text-xs text-cyan-200/60">
                            {{ formatTime(track.duration) }}
                        </span>
                        <button @click.stop="addToQueue(track)"
                            class="w-6 h-6 opacity-0 group-hover:opacity-100 hover:bg-cyan-500/20 rounded flex items-center justify-center transition-all text-cyan-200/70 hover:text-cyan-400"
                            title="Añadir a la cola">
                            <i class="pi pi-plus text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cola de reproducción -->
        <div v-if="trackQueue.length > 0" class="border-t border-slate-700/50 p-4">
            <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium text-sm text-cyan-100">Siguiente en cola</h3>
                <button @click="clearQueue" class="text-xs text-cyan-200/60 hover:text-cyan-400 transition-colors">
                    Limpiar
                </button>
            </div>
            <div class="space-y-2 max-h-32 overflow-y-auto scrollbar-hide">
                <div v-for="(track, index) in trackQueue" :key="track.id"
                    class="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-700/30 text-sm transition-colors group border border-transparent hover:border-slate-600/30">
                    <span class="text-xs text-cyan-200/60 w-4">{{ index + 1 }}</span>
                    <img :src="track.cover || '/default-cover.jpg'" :alt="track.title"
                        class="w-8 h-8 rounded-lg object-cover border border-slate-600/50" />
                    <div class="flex-1 min-w-0">
                        <p class="truncate text-cyan-100">{{ track.title }}</p>
                        <p class="text-xs text-cyan-200/70 truncate">{{ track.artist }}</p>
                    </div>
                    <button @click="removeFromQueue(track.id)"
                        class="w-6 h-6 opacity-0 group-hover:opacity-100 hover:bg-cyan-500/20 rounded flex items-center justify-center transition-colors text-cyan-200/60 hover:text-cyan-400">
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
import { onMounted, onUnmounted } from 'vue'

// Store de música
const musicStore = useMusicStore()

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
    playRandomTrack // Usamos la nueva función del store
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
    console.log('🎵 Configurando listeners globales...')
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
onMounted(() => {
    console.log('🎵 Montando MusicPlayer...')
    initAudioPlayer()
    setTimeout(() => {
        setupGlobalListeners()
    }, 1000)
})

onUnmounted(() => {
    removeGlobalListeners()
})
</script>

<style scoped>
/* Tus estilos CSS permanecen iguales */
.glass-effect {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(148, 163, 184, 0.2);
}

.music-progress {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 10px;
    background: rgba(148, 163, 184, 0.2);
    outline: none;
    transition: all 0.2s ease;
}

.music-progress:hover {
    background: rgba(148, 163, 184, 0.3);
}

.music-progress::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #22d3ee;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
    transition: all 0.2s ease;
}

.music-progress::-webkit-slider-thumb:hover {
    background: #06b6d4;
    transform: scale(1.1);
}

.volume-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    border-radius: 10px;
    background: rgba(148, 163, 184, 0.2);
    outline: none;
    transition: all 0.2s ease;
}

.volume-slider:hover {
    background: rgba(148, 163, 184, 0.3);
}

.volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #22d3ee;
    cursor: pointer;
    transition: all 0.2s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
    background: #06b6d4;
    transform: scale(1.1);
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.animate-spin-slow {
    animation: spin 8s linear infinite;
}

.animate-bounce-slow {
    animation: bounce 1.5s infinite;
}

.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

.animate-slide-up {
    animation: slideUp 0.3s ease-out;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-4px);
    }
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

@keyframes slideUp {
    from {
        transform: translateY(8px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>