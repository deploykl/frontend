import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface Track {
  id: string
  title: string
  artist: string
  url: string
  duration: number
  cover?: string
}

interface MusicStore {
  isPlaying: Ref<boolean>
  currentTrack: Ref<Track | null>
  currentTime: Ref<number>
  trackHistory: Ref<Track[]>
  trackQueue: Ref<Track[]>
  showMusicPanel: Ref<boolean>
  volume: Ref<number>
  audioPlayer: Ref<HTMLAudioElement | null>
  isMuted: Ref<boolean>
  isShuffled: Ref<boolean>
  repeatMode: Ref<'none' | 'one' | 'all'>
  allowedRoutes: Ref<string[]>
  tracks: Ref<Track[]>
  
  // Methods
  isRouteAllowed: (routePath: string) => boolean
  checkRouteAndPause: (routePath: string) => void
  pauseMusic: () => void
  initAudioPlayer: () => void
  checkAudioSource: (url: string) => Promise<boolean>
  getRandomTrack: () => Track | null
  playNextTrack: () => Promise<void>
  playPreviousTrack: () => void
  togglePlayback: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  seekTo: (time: number) => void
  adjustVolume: (newVolume: string) => void
  toggleMusicPanel: () => void
  hideMusicPanel: () => void
  enableAudio: () => void
  cleanup: () => void
  activateAudioGlobally: () => void
  addToQueue: (track: Track) => void
  removeFromQueue: (trackId: string) => void
  clearQueue: () => void
  playTrack: (track: Track) => Promise<void>
  getRealDuration: (url: string) => Promise<number>
}

export const useMusicStore = defineStore('music', (): MusicStore => {
  const isPlaying = ref<boolean>(false)
  const currentTrack = ref<Track | null>(null)
  const currentTime = ref<number>(0)
  const trackHistory = ref<Track[]>([])
  const trackQueue = ref<Track[]>([])
  const showMusicPanel = ref<boolean>(false)
  const volume = ref<number>(0.25)
  const audioPlayer = ref<HTMLAudioElement | null>(null)
  const isMuted = ref<boolean>(true)
  const isShuffled = ref<boolean>(false)
  const repeatMode = ref<'none' | 'one' | 'all'>('none')

  const allowedRoutes = ref<string[]>(['/', '/dg', '/dimon', '/diem', '/main'])

  // Inicializar tracks con duración 0 - se actualizará con la duración real
  const tracks = ref<Track[]>([
    {
      id: '1',
      title: 'Canción Inspiradora',
      artist: 'Artista 1',
      url: new URL('/src/assets/audios/playlist/song1.ogg', import.meta.url).href,
      duration: 0, // Se actualizará con la duración real
      cover: 'https://pics.craiyon.com/2023-06-10/824095a92e854b7bbec3d39728b2e0b6.webp'
    },
    {
      id: '2',
      title: 'Melodía Relajante',
      artist: 'Artista 2',
      url: new URL('/src/assets/audios/playlist/song2.ogg', import.meta.url).href,
      duration: 0, // Se actualizará con la duración real
      cover: 'https://pics.craiyon.com/2023-06-10/824095a92e854b7bbec3d39728b2e0b6.webp'
    },
    {
      id: '3',
      title: 'Ritmo Energético',
      artist: 'Artista 3',
      url: new URL('/src/assets/audios/playlist/song3.ogg', import.meta.url).href,
      duration: 0, // Se actualizará con la duración real
      cover: 'https://pics.craiyon.com/2023-06-10/824095a92e854b7bbec3d39728b2e0b6.webp'
    },
    {
      id: '4',
      title: 'Armonía Natural',
      artist: 'Artista 4',
      url: new URL('/src/assets/audios/playlist/song4.ogg', import.meta.url).href,
      duration: 0, // Se actualizará con la duración real
      cover: 'https://pics.craiyon.com/2023-06-10/824095a92e854b7bbec3d39728b2e0b6.webp'
    },
    {
      id: '5',
      title: 'Sinfónica Digital',
      artist: 'Artista 5',
      url: new URL('/src/assets/audios/playlist/song5.ogg', import.meta.url).href,
      duration: 0, // Se actualizará con la duración real
      cover: 'https://pics.craiyon.com/2023-06-10/824095a92e854b7bbec3d39728b2e0b6.webp'
    },
    {
      id: '6',
      title: 'Juro que te amo',
      artist: 'Los terricolas',
      url: new URL('/src/assets/audios/playlist/song6.ogg', import.meta.url).href,
      duration: 0, // Se actualizará con la duración real
      cover: 'https://pics.craiyon.com/2023-06-10/824095a92e854b7bbec3d39728b2e0b6.webp'
    }
  ])

  // Función para obtener la duración real del audio
  const getRealDuration = async (url: string): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio()
      
      const handleLoadedMetadata = () => {
        resolve(audio.duration)
        cleanupAudio()
      }
      
      const handleError = () => {
        console.warn(`No se pudo cargar la duración de: ${url}`)
        resolve(0)
        cleanupAudio()
      }
      
      const cleanupAudio = () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('error', handleError)
        audio.src = ''
      }
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('error', handleError)
      audio.src = url
    })
  }

  // Inicializar duraciones reales al cargar el store
// Inicializar duraciones reales al cargar el store
const initializeTrackDurations = async () => {
  const updatedTracks = [...tracks.value]
  
  for (let i = 0; i < updatedTracks.length; i++) {
    const track = updatedTracks[i]
    // Verificación para evitar undefined
    if (!track) continue
    
    try {
      const realDuration = await getRealDuration(track.url)
      if (realDuration > 0) {
        track.duration = Math.floor(realDuration) // Redondear a segundos enteros
      }
    } catch (error) {
      console.warn(`Error obteniendo duración para ${track.title}:`, error)
    }
  }
  
  tracks.value = updatedTracks
}

  // Llamar a la inicialización de duraciones
  initializeTrackDurations()

  const isRouteAllowed = (routePath: string): boolean => {
    return allowedRoutes.value.includes(routePath)
  }

  const checkRouteAndPause = (routePath: string): void => {
    if (!isRouteAllowed(routePath)) {
      pauseMusic()
    }
  }


  const activateAudioGlobally = (): void => {
    if (!audioPlayer.value) {
      initAudioPlayer()
    }
    
    if (audioPlayer.value) {
      audioPlayer.value.muted = false
      isMuted.value = false
      
      if (!currentTrack.value) {
        playNextTrack()
      }
    }
  }

  const pauseMusic = (): void => {
    if (audioPlayer.value && isPlaying.value) {
      audioPlayer.value.pause()
      isPlaying.value = false
    }
  }

  const initAudioPlayer = (): void => {
    if (!audioPlayer.value) {
      audioPlayer.value = new Audio()
      audioPlayer.value.volume = volume.value
      audioPlayer.value.muted = true
      audioPlayer.value.preload = 'auto'
      
      audioPlayer.value.addEventListener('ended', handleTrackEnd)
      audioPlayer.value.addEventListener('timeupdate', updateCurrentTime)
      audioPlayer.value.addEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }

  const handleTrackEnd = (): void => {
    if (repeatMode.value === 'one') {
      audioPlayer.value?.play()
    } else {
      playNextTrack()
    }
  }

  const updateCurrentTime = (): void => {
    if (audioPlayer.value) {
      currentTime.value = audioPlayer.value.currentTime
    }
  }

const handleLoadedMetadata = (): void => {
  if (audioPlayer.value && currentTrack.value) {
    // Actualizar la duración del track actual con la duración real
    const realDuration = audioPlayer.value.duration
    if (realDuration && realDuration > 0 && !isNaN(realDuration)) {
      const updatedTrack = { 
        ...currentTrack.value, 
        duration: Math.floor(realDuration) 
      }
      currentTrack.value = updatedTrack
      
      // También actualizar en la lista de tracks
      const trackIndex = tracks.value.findIndex(t => t.id === currentTrack.value?.id)
      if (trackIndex !== -1) {
        const updatedTracks = [...tracks.value]
        const trackToUpdate = updatedTracks[trackIndex]
        // Verificar que el track existe antes de modificarlo
        if (trackToUpdate) {
          trackToUpdate.duration = Math.floor(realDuration)
          tracks.value = updatedTracks
        }
      }
    }
  }
}

  const checkAudioSource = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.error(`Error verificando ${url}:`, error)
      return false
    }
  }

  const getRandomTrack = (): Track | null => {
    if (tracks.value.length === 0) return null
    
    if (trackHistory.value.length >= tracks.value.length) {
      trackHistory.value = []
    }

    const availableTracks = tracks.value.filter(track => 
      !trackHistory.value.some(historyTrack => historyTrack.id === track.id)
    )
    
    if (availableTracks.length === 0) return null

    const randomIndex = Math.floor(Math.random() * availableTracks.length)
    const selectedTrack = availableTracks[randomIndex]
    
    return selectedTrack || null
  }

  const getNextTrackInOrder = (): Track | null => {
    if (tracks.value.length === 0) return null
    if (!currentTrack.value) return tracks.value[0] || null
    
    const currentIndex = tracks.value.findIndex(t => t.id === currentTrack.value?.id)
    if (currentIndex === -1) return tracks.value[0] || null
    
    const nextIndex = (currentIndex + 1) % tracks.value.length
    const nextTrack = tracks.value[nextIndex]
    
    return nextTrack || null
  }

  const playNextTrack = async (): Promise<void> => {
    // Primero verificar si hay tracks en la cola
    if (trackQueue.value.length > 0) {
      const nextTrack = trackQueue.value.shift()
      if (nextTrack) {
        await playTrack(nextTrack)
        return
      }
    }

    // Si no hay cola, continuar con el sistema normal
    if (repeatMode.value === 'all' && currentTrack.value) {
      await playTrack(currentTrack.value)
      return
    }

    const track = isShuffled.value ? getRandomTrack() : getNextTrackInOrder()
    if (!track) {
      console.log('No hay pistas disponibles')
      return
    }

    await playTrack(track)
  }

  const playPreviousTrack = (): void => {
    if (trackHistory.value.length > 0) {
      const previousTrack = trackHistory.value.pop()
      if (previousTrack && currentTrack.value) {
        trackQueue.value.unshift(currentTrack.value)
        playTrack(previousTrack)
      }
    } else if (currentTrack.value) {
      // Si no hay historial, reiniciar la canción actual
      if (audioPlayer.value) {
        audioPlayer.value.currentTime = 0
        audioPlayer.value.play()
      }
    }
  }

  const playTrack = async (track: Track): Promise<void> => {
    if (currentTrack.value) {
      trackHistory.value.push(currentTrack.value)
    }

    const isValidSource = await checkAudioSource(track.url)
    if (!isValidSource) {
      console.error(`La fuente de audio no existe: ${track.url}`)
      setTimeout(playNextTrack, 1000)
      return
    }

    if (audioPlayer.value) {
      currentTrack.value = track
      audioPlayer.value.src = track.url
      audioPlayer.value.muted = false
      isMuted.value = false
      
      try {
        await audioPlayer.value.play()
        isPlaying.value = true
        
        // Esperar a que se carguen los metadatos para obtener duración real
        if (audioPlayer.value.readyState >= 1) {
          const realDuration = audioPlayer.value.duration
          if (realDuration && realDuration > 0 && !isNaN(realDuration)) {
            const updatedTrack = { 
              ...currentTrack.value, 
              duration: Math.floor(realDuration) 
            }
            currentTrack.value = updatedTrack
          }
        }
      } catch (error) {
        console.error("Error al reproducir audio:", error)
        isPlaying.value = false
        setTimeout(playNextTrack, 1000)
      }
    }
  }

  const togglePlayback = (): void => {
    activateAudioGlobally()
    
    if (!audioPlayer.value) {
      initAudioPlayer()
      playNextTrack()
      return
    }

    if (isPlaying.value) {
      pauseMusic()
    } else {
      if (!currentTrack.value) {
        playNextTrack()
      } else {
        audioPlayer.value.play()
          .then(() => { isPlaying.value = true })
          .catch((error: Error) => { 
            console.error("Error al reanudar audio:", error)
            playNextTrack()
          })
      }
    }
  }

  const toggleShuffle = (): void => {
    isShuffled.value = !isShuffled.value
  }

  const toggleRepeat = (): void => {
    if (repeatMode.value === 'none') {
      repeatMode.value = 'one'
    } else if (repeatMode.value === 'one') {
      repeatMode.value = 'all'
    } else {
      repeatMode.value = 'none'
    }
  }

  const seekTo = (time: number): void => {
    if (audioPlayer.value) {
      audioPlayer.value.currentTime = time
    }
  }

  const adjustVolume = (newVolume: string): void => {
    const newVol = parseFloat(newVolume)
    if (!isNaN(newVol)) {
      volume.value = newVol
      if (audioPlayer.value) {
        audioPlayer.value.volume = volume.value
      }
    }
  }

  const toggleMusicPanel = (): void => {
    showMusicPanel.value = !showMusicPanel.value
  }

  const hideMusicPanel = (): void => {
    showMusicPanel.value = false
  }

  const enableAudio = (): void => {
    if (audioPlayer.value && audioPlayer.value.muted) {
      audioPlayer.value.muted = false
      isMuted.value = false
    }
  }

  const addToQueue = (track: Track): void => {
    trackQueue.value.push(track)
  }

  const removeFromQueue = (trackId: string): void => {
    trackQueue.value = trackQueue.value.filter(track => track.id !== trackId)
  }

  const clearQueue = (): void => {
    trackQueue.value = []
  }

  const cleanup = (): void => {
    if (audioPlayer.value) {
      audioPlayer.value.pause()
      audioPlayer.value.removeEventListener('ended', handleTrackEnd)
      audioPlayer.value.removeEventListener('timeupdate', updateCurrentTime)
      audioPlayer.value.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audioPlayer.value = null
    }
  }

  return {
    isPlaying,
    currentTrack,
    currentTime,
    trackHistory,
    trackQueue,
    showMusicPanel,
    volume,
    audioPlayer,
    isMuted,
    isShuffled,
    repeatMode,
    allowedRoutes,
    tracks,
    isRouteAllowed,
    checkRouteAndPause,
    pauseMusic,
    initAudioPlayer,
    checkAudioSource,
    getRandomTrack,
    playNextTrack,
    playPreviousTrack,
    togglePlayback,
    toggleShuffle,
    toggleRepeat,
    seekTo,
    adjustVolume,
    toggleMusicPanel,
    hideMusicPanel,
    enableAudio,
    cleanup,
    activateAudioGlobally,
    addToQueue,
    removeFromQueue,
    clearQueue,
    playTrack,
    getRealDuration
  }
})