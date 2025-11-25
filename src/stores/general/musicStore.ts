import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

interface MusicStore {
  isPlaying: Ref<boolean>
  currentTrack: Ref<string>
  trackHistory: Ref<string[]>
  showMusicPanel: Ref<boolean>
  volume: Ref<number>
  audioPlayer: Ref<HTMLAudioElement | null>
  isMuted: Ref<boolean>
  allowedRoutes: Ref<string[]>
  tracks: Ref<string[]>
  
  // Methods
  isRouteAllowed: (routePath: string) => boolean
  checkRouteAndPause: (routePath: string) => void
  pauseMusic: () => void
  initAudioPlayer: () => void
  checkAudioSource: (url: string) => Promise<boolean>
  getRandomTrack: () => string | null
  playNextTrack: () => Promise<void>
  togglePlayback: () => void
  adjustVolume: (newVolume: string) => void
  toggleMusicPanel: () => void
  hideMusicPanel: () => void
  enableAudio: () => void
  cleanup: () => void
  activateAudioGlobally: () => void
}

export const useMusicStore = defineStore('music', (): MusicStore => {
  const isPlaying = ref<boolean>(false)
  const currentTrack = ref<string>('')
  const trackHistory = ref<string[]>([])
  const showMusicPanel = ref<boolean>(false)
  const volume = ref<number>(0.1)
  const audioPlayer = ref<HTMLAudioElement | null>(null)
  const isMuted = ref<boolean>(true) // Iniciar como muted

  // Rutas donde se permite música
  const allowedRoutes = ref<string[]>(['/', '/dg', '/dimon', '/diem', '/main'])

  const tracks = ref<string[]>([
    new URL('/src/assets/audios/playlist/song1.ogg', import.meta.url).href,
    new URL('/src/assets/audios/playlist/song2.ogg', import.meta.url).href,
    new URL('/src/assets/audios/playlist/song3.ogg', import.meta.url).href,
    new URL('/src/assets/audios/playlist/song4.ogg', import.meta.url).href,
    new URL('/src/assets/audios/playlist/song5.ogg', import.meta.url).href,
  ])

  // Función para verificar si una ruta permite música
  const isRouteAllowed = (routePath: string): boolean => {
    return allowedRoutes.value.includes(routePath)
  }

  // Función para pausar música si la ruta no está permitida
  const checkRouteAndPause = (routePath: string): void => {
    if (!isRouteAllowed(routePath)) {
      pauseMusic()
    }
  }

  const enableAudioOnInteraction = (): void => {
    if (audioPlayer.value && isMuted.value) {
      audioPlayer.value.muted = false
      isMuted.value = false
      console.log('Audio activado por interacción del usuario')
    }
  }

  // MÉTODO CORREGIDO: Activar audio globalmente
  const activateAudioGlobally = (): void => {
    console.log('🎵 Intentando activar audio globalmente...')
    
    // Asegurarse de que el reproductor esté inicializado
    if (!audioPlayer.value) {
      console.log('🎵 Inicializando reproductor...')
      initAudioPlayer()
    }
    
    if (audioPlayer.value) {
      console.log('🎵 Quitando mute del audio...')
      audioPlayer.value.muted = false
      isMuted.value = false
      
      // Si no hay track actual, cargar uno
      if (!currentTrack.value) {
        console.log('🎵 No hay track actual, cargando uno...')
        playNextTrack()
      } else if (!isPlaying.value) {
        // Si hay track pero no se está reproduciendo, intentar reproducir
        console.log('🎵 Intentando reanudar reproducción...')
        audioPlayer.value.play()
          .then(() => {
            isPlaying.value = true
            console.log('🔊 Audio activado y reproduciendo')
          })
          .catch(error => {
            console.log('⚠️ No se pudo reproducir automáticamente:', error)
            // Intentar con otro track
            playNextTrack()
          })
      } else {
        console.log('🔊 Audio ya estaba activado y reproduciendo')
      }
    }
  }

  // Pausar la música
  const pauseMusic = (): void => {
    if (audioPlayer.value && isPlaying.value) {
      audioPlayer.value.pause()
      isPlaying.value = false
      console.log('Música pausada')
    }
  }

  // Inicializar el reproductor de audio
  const initAudioPlayer = (): void => {
    if (!audioPlayer.value) {
      audioPlayer.value = new Audio()
      audioPlayer.value.volume = volume.value
      audioPlayer.value.muted = true // Empezar muted por políticas de autoplay
      audioPlayer.value.preload = 'auto'
      audioPlayer.value.addEventListener('ended', playNextTrack)
      console.log('🎵 Reproductor de audio inicializado')
    }
  }

  // Verificar si una URL de audio es válida
  const checkAudioSource = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.error(`Error verificando ${url}:`, error)
      return false
    }
  }

  // Obtener pista aleatoria
  const getRandomTrack = (): string | null => {
    if (tracks.value.length === 0) return null
    
    // Reiniciar historial si está lleno
    if (trackHistory.value.length >= tracks.value.length) {
      trackHistory.value = []
    }

    const availableTracks = tracks.value.filter(track => !trackHistory.value.includes(track))
    
    if (availableTracks.length === 0) return null

    const randomIndex = Math.floor(Math.random() * availableTracks.length)
    const selectedTrack = availableTracks[randomIndex]
    
    return selectedTrack || null
  }

  // Reproducir siguiente pista
  const playNextTrack = async (): Promise<void> => {
    const track = getRandomTrack()
    if (!track) {
      console.log('No hay pistas disponibles para reproducir')
      return
    }

    const isValidSource = await checkAudioSource(track)
    if (!isValidSource) {
      console.error(`La fuente de audio no existe: ${track}`)
      setTimeout(playNextTrack, 1000)
      return
    }

    trackHistory.value.push(track)

    if (audioPlayer.value) {
      currentTrack.value = track
      audioPlayer.value.src = track
      
      // Asegurarse de que no esté muted antes de reproducir
      audioPlayer.value.muted = false
      isMuted.value = false
      
      try {
        await audioPlayer.value.play()
        isPlaying.value = true
        console.log('🎵 Reproduciendo:', track)
      } catch (error) {
        console.error("Error al reproducir audio:", error)
        isPlaying.value = false
        setTimeout(playNextTrack, 1000)
      }
    }
  }

  // Toggle reproducción
  const togglePlayback = (): void => {
    // Activar audio en la primera interacción
    activateAudioGlobally()
    
    if (!audioPlayer.value) {
      initAudioPlayer()
      playNextTrack()
      return
    }

    if (isPlaying.value) {
      pauseMusic()
    } else {
      audioPlayer.value.play()
        .then(() => { 
          isPlaying.value = true 
        })
        .catch((error: Error) => { 
          console.error("Error al reanudar audio:", error)
          playNextTrack()
        })
    }
  }

  // Ajustar volumen
  const adjustVolume = (newVolume: string): void => {
    volume.value = parseFloat(newVolume)
    if (audioPlayer.value) {
      audioPlayer.value.volume = volume.value
    }
  }

  // Mostrar/ocultar panel
  const toggleMusicPanel = (): void => {
    showMusicPanel.value = !showMusicPanel.value
  }

  // Ocultar panel
  const hideMusicPanel = (): void => {
    showMusicPanel.value = false
  }

  // Activar audio (quitar mute)
  const enableAudio = (): void => {
    if (audioPlayer.value && audioPlayer.value.muted) {
      audioPlayer.value.muted = false
      isMuted.value = false
      console.log('Audio activado')
    }
  }

  // Limpiar recursos
  const cleanup = (): void => {
    if (audioPlayer.value) {
      audioPlayer.value.pause()
      audioPlayer.value.removeEventListener('ended', playNextTrack)
      console.log('Reproductor de audio limpiado')
    }
  }

  return {
    isPlaying,
    currentTrack,
    trackHistory,
    showMusicPanel,
    volume,
    audioPlayer,
    isMuted,
    allowedRoutes,
    tracks,
    isRouteAllowed,
    checkRouteAndPause,
    pauseMusic,
    initAudioPlayer,
    checkAudioSource,
    getRandomTrack,
    playNextTrack,
    togglePlayback,
    adjustVolume,
    toggleMusicPanel,
    hideMusicPanel,
    enableAudio,
    cleanup,
    activateAudioGlobally
  }
})