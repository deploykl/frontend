<template>
  <!-- Botón flotante de música -->
  <div 
    class="music-floating-btn" 
    v-if="!showMusicPanel" 
    @click="handleMusicButtonClick"
    :class="{ 'pulse-animation': isPlaying }"
  >
    <i :class="isPlaying ? 'pi pi-pause' : 'pi pi-volume-up'"></i>
  </div>

  <!-- Panel de controles -->
  <div class="music-player-panel" v-if="showMusicPanel">
    <div class="panel-header">
      <span class="panel-title">Reproductor de Música</span>
      <button class="close-btn" @click="hideMusicPanel">
        <i class="pi pi-times"></i>
      </button>
    </div>

    <div class="panel-content">
      <button class="playback-btn" @click="handlePlaybackClick">
        <i :class="isPlaying ? 'pi pi-pause' : 'pi pi-play'"></i>
      </button>
      
      <div class="track-info">
        <span class="status-text">
          {{ isPlaying ? 'Reproduciendo' : 'Pausado' }}
        </span>
        <small class="track-name">{{ currentTrackName }}</small>
      </div>
      
      <!-- Botón para forzar activación si es necesario -->
      <button v-if="!audioActivated" class="activate-btn" @click="forceAudioActivation">
        🔇 Activar Audio
      </button>
    </div>

    <div class="volume-container">
      <i class="pi pi-volume-down volume-icon"></i>
      <input 
        type="range" 
        class="volume-slider" 
        min="0" 
        max="1" 
        step="0.1" 
        :value="volume"
        @input="adjustVolume(($event.target as HTMLInputElement).value)"
      >
      <i class="pi pi-volume-up volume-icon"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMusicStore } from '@/stores/general/musicStore'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const musicStore = useMusicStore()
const { isPlaying, showMusicPanel, volume, currentTrack } = storeToRefs(musicStore)
const { togglePlayback, adjustVolume, toggleMusicPanel, hideMusicPanel, activateAudioGlobally, initAudioPlayer } = musicStore

// Computed para mostrar nombre del track
const currentTrackName = computed(() => {
  if (!currentTrack.value) return 'Seleccionando canción...'
  const trackName = currentTrack.value.split('/').pop() || 'Canción actual'
  return trackName.replace('.ogg', '').replace(/%20/g, ' ')
})

// Referencia para controlar si ya se activó
const audioActivated = ref(false)

// Función para activar audio
const handleGlobalClick = () => {
  if (!audioActivated.value) {
    console.log('🎵 Click global detectado, activando audio...')
    forceAudioActivation()
  }
}

// Función para forzar activación de audio
const forceAudioActivation = () => {
  console.log('🎵 Forzando activación de audio...')
  initAudioPlayer()
  activateAudioGlobally()
  audioActivated.value = true
}

// Manejar click en el botón de música
const handleMusicButtonClick = () => {
  console.log('🎵 Click en botón de música')
  forceAudioActivation()
  toggleMusicPanel()
}

// Manejar click en reproducción
const handlePlaybackClick = () => {
  console.log('🎵 Click en botón de reproducción')
  forceAudioActivation()
  togglePlayback()
}

// Configurar event listeners globales
const setupGlobalListeners = () => {
  console.log('🎵 Configurando listeners globales...')
  
  // Agregar múltiples eventos para capturar cualquier interacción
  document.addEventListener('click', handleGlobalClick)
  document.addEventListener('mousedown', handleGlobalClick)
  document.addEventListener('touchstart', handleGlobalClick)
  document.addEventListener('keydown', handleGlobalClick)
  document.addEventListener('mousemove', handleGlobalClick)
  
  console.log('🎵 Listeners globales configurados')
}

// Remover listeners
const removeGlobalListeners = () => {
  document.removeEventListener('click', handleGlobalClick)
  document.removeEventListener('mousedown', handleGlobalClick)
  document.removeEventListener('touchstart', handleGlobalClick)
  document.removeEventListener('keydown', handleGlobalClick)
  document.removeEventListener('mousemove', handleGlobalClick)
}

onMounted(() => {
  console.log('🎵 Montando GlobalMusicPlayer...')
  // Inicializar el reproductor inmediatamente
  initAudioPlayer()
  // Configurar listeners después de un breve delay
  setTimeout(() => {
    setupGlobalListeners()
  }, 1000)
})

onUnmounted(() => {
  removeGlobalListeners()
})
</script>

<style scoped>
.music-floating-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: #54bef0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  z-index: 10000;
  transition: all 0.3s ease;
  border: 2px solid white;
  color: white;
  font-size: 1.2rem;
}

.music-floating-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
  background: #3b82f6;
}

.music-floating-btn.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(84, 190, 240, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(84, 190, 240, 0); }
  100% { box-shadow: 0 0 0 0 rgba(84, 190, 240, 0); }
}

.music-player-panel {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 320px;
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  transition: all 0.3s ease;
  border: 1px solid #eaeaea;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8fafc;
}

.panel-title {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.panel-content {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.track-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.status-text {
  font-weight: 500;
  color: #333;
  font-size: 0.85rem;
}

.track-name {
  color: #666;
  font-size: 0.75rem;
  margin-top: 2px;
  word-break: break-word;
}

.playback-btn {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.playback-btn:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.05);
}

.activate-btn {
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.activate-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.close-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #9ca3af;
  color: #9ca3af;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #9ca3af;
  color: white;
}

.volume-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
}

.volume-icon {
  color: #3b82f6;
  font-size: 0.875rem;
}

.volume-slider {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 8px;
  appearance: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  background: #2563eb;
}
</style>