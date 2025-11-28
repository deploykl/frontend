// stores/general/musicStore.ts - VERSIÓN COMPLETA CORREGIDA
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface Track {
  id: string
  title: string
  artist: string
  url: string
  duration: number
  cover?: string
  durationLoaded?: boolean
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
  playPreviousTrack: () => Promise<void>
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
  playRandomTrack: () => Promise<void>
  loadTracks: () => Promise<void>
  releaseMemory: () => void
  initializeAllDurations: () => Promise<void>
  loadTrackDuration: (track: Track) => Promise<void>
}

export const useMusicStore = defineStore('music', (): MusicStore => {
  // Estados
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
  const tracks = ref<Track[]>([])

  // Cache de duraciones
  const durationCache = ref<Map<string, number>>(new Map())
  const preloadAudios: HTMLAudioElement[] = []
  const MAX_CONCURRENT_PRELOADS = 3

  // Función optimizada para obtener duración
  const getRealDuration = async (url: string): Promise<number> => {
    if (durationCache.value.has(url)) {
      return durationCache.value.get(url)!
    }

    return new Promise((resolve) => {
      const audio = new Audio()
      preloadAudios.push(audio)

      const cleanup = () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('error', handleError)
        audio.src = ''
        
        setTimeout(() => {
          const index = preloadAudios.indexOf(audio)
          if (index > -1) {
            preloadAudios.splice(index, 1)
          }
        }, 1000)
      }

      const handleLoadedMetadata = () => {
        const duration = audio.duration && !isNaN(audio.duration) ? Math.floor(audio.duration) : 0
        durationCache.value.set(url, duration)
        cleanup()
        resolve(duration)
      }

      const handleError = () => {
        console.warn(`No se pudo cargar la duración de: ${url}`)
        durationCache.value.set(url, 0)
        cleanup()
        resolve(0)
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('error', handleError)
      audio.src = url
      audio.preload = 'metadata'
      
      // Timeout de seguridad
      setTimeout(() => {
        if (!durationCache.value.has(url)) {
          console.warn(`Timeout cargando duración: ${url}`)
          durationCache.value.set(url, 0)
          cleanup()
          resolve(0)
        }
      }, 10000)
    })
  }

  // Cargar duración de un track individual
const loadTrackDuration = async (track: Track): Promise<void> => {
  if (track.durationLoaded || track.duration > 0) {
    return
  }

  try {
    const realDuration = await getRealDuration(track.url)
    
    const trackIndex = tracks.value.findIndex(t => t.id === track.id)
    if (trackIndex !== -1) {
      const updatedTracks = [...tracks.value]
      const existingTrack = updatedTracks[trackIndex]
      
      if (existingTrack) { // ✅ Verificar que existe
        updatedTracks[trackIndex] = {
          ...existingTrack, // ✅ TypeScript sabe que existe
          duration: realDuration,
          durationLoaded: true
        }
        tracks.value = updatedTracks
      }
    }
  } catch (error) {
    console.warn(`Error cargando duración para ${track.title}:`, error)
  }
}

  // Inicializar todas las duraciones de forma eficiente
  const initializeAllDurations = async (): Promise<void> => {
    if (tracks.value.length === 0) return

    console.log('🔄 Inicializando duraciones de tracks...')
    
    const tracksNeedingDuration = tracks.value.filter(track => 
      !track.durationLoaded && track.duration === 0
    )

    console.log(`📊 ${tracksNeedingDuration.length} tracks necesitan duración`)

    const batchSize = MAX_CONCURRENT_PRELOADS
    for (let i = 0; i < tracksNeedingDuration.length; i += batchSize) {
      const batch = tracksNeedingDuration.slice(i, i + batchSize)
      
      await Promise.allSettled(
        batch.map(track => loadTrackDuration(track))
      )
      
      console.log(`✅ Lote ${Math.floor(i/batchSize) + 1} completado`)
      
      if (i + batchSize < tracksNeedingDuration.length) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    console.log('🎉 Todas las duraciones inicializadas')
  }

  const loadTracks = async (): Promise<void> => {
    if (tracks.value.length > 0) return

    const trackList: Track[] = [
      {
        id: '1',
        title: 'Canción Inspiradora',
        artist: 'Artista 1',
        url: new URL('/src/assets/audios/playlist/song1.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '2',
        title: 'Melodía Relajante',
        artist: 'Artista 2',
        url: new URL('/src/assets/audios/playlist/song2.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '3',
        title: 'Ritmo Energético',
        artist: 'Artista 3',
        url: new URL('/src/assets/audios/playlist/song3.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '4',
        title: 'Te Amo',
        artist: 'Manuel Mijares',
        url: new URL('/src/assets/audios/playlist/song4.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '5',
        title: 'Sinfónica Digital',
        artist: 'Artista 5',
        url: new URL('/src/assets/audios/playlist/song5.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '6',
        title: 'Juro que te amo',
        artist: 'Los terricolas',
        url: new URL('/src/assets/audios/playlist/song6.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '7',
        title: 'Over at the Frankenstein Place',
        artist: 'Richard O\'Brien',
        url: new URL('/src/assets/audios/playlist/song7.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '8',
        title: 'Emotion',
        artist: 'Samantha Sang',
        url: new URL('/src/assets/audios/playlist/song8.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '9',
        title: 'La Isla Bonita',
        artist: 'Madonna',
        url: new URL('/src/assets/audios/playlist/song9.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '10',
        title: 'Más allá del sol',
        artist: 'Joan Sebastian',
        url: new URL('/src/assets/audios/playlist/song10.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '11',
        title: 'Tutu',
        artist: 'Camilo, Pedro Capó',
        url: new URL('/src/assets/audios/playlist/song11.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '12',
        title: 'Manic Monday',
        artist: 'The Bangles',
        url: new URL('/src/assets/audios/playlist/song12.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      },
      {
        id: '13',
        title: 'Praise Jah in the Moonlight',
        artist: 'YG Marley',
        url: new URL('/src/assets/audios/playlist/song13.ogg', import.meta.url).href,
        duration: 0,
        cover: new URL('/src/assets/icons/music/fondo_music.webp', import.meta.url).href,
        durationLoaded: false
      }
    ]

    tracks.value = trackList
    
    // INICIAR CARGA DE DURACIONES EN SEGUNDO PLANO
    setTimeout(async () => {
      await initializeAllDurations()
    }, 1000)
  }

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
    
    if (tracks.value.length === 0) {
      loadTracks()
    }
    
    if (audioPlayer.value) {
      audioPlayer.value.muted = false
      isMuted.value = false
      
      if (!currentTrack.value && tracks.value.length > 0) {
        playRandomTrack()
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
      audioPlayer.value.preload = 'metadata'
      
      audioPlayer.value.addEventListener('ended', handleTrackEnd)
      audioPlayer.value.addEventListener('timeupdate', updateCurrentTime)
      audioPlayer.value.addEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }

  const handleTrackEnd = (): void => {
    if (repeatMode.value === 'one' && currentTrack.value) {
      audioPlayer.value?.play().catch(console.error)
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
      const realDuration = audioPlayer.value.duration
      if (realDuration && realDuration > 0 && !isNaN(realDuration)) {
        const updatedTrack = { 
          ...currentTrack.value, 
          duration: Math.floor(realDuration) 
        }
        currentTrack.value = updatedTrack
        
        const trackIndex = tracks.value.findIndex(t => t.id === currentTrack.value?.id)
        if (trackIndex !== -1) {
          const updatedTracks = [...tracks.value]
          const trackToUpdate = updatedTracks[trackIndex]
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
    
    if (availableTracks.length === 0) {
      trackHistory.value = []
      return tracks.value[0] || null
    }

    const randomIndex = Math.floor(Math.random() * availableTracks.length)
    return availableTracks[randomIndex] || null
  }

  const getNextTrackInOrder = (): Track | null => {
    if (tracks.value.length === 0) return null
    if (!currentTrack.value) return tracks.value[0] || null
    
    const currentIndex = tracks.value.findIndex(t => t.id === currentTrack.value?.id)
    if (currentIndex === -1) return tracks.value[0] || null
    
    const nextIndex = (currentIndex + 1) % tracks.value.length
    return tracks.value[nextIndex] || null
  }

  const playNextTrack = async (): Promise<void> => {
    if (trackQueue.value.length > 0) {
      const nextTrack = trackQueue.value.shift()
      if (nextTrack) {
        await playTrack(nextTrack)
        return
      }
    }

    if (repeatMode.value === 'all' && currentTrack.value) {
      await playTrack(currentTrack.value)
      return
    }

    const track = isShuffled.value ? getRandomTrack() : getNextTrackInOrder()
    if (!track) {
      console.log('No hay pistas disponibles')
      isPlaying.value = false
      return
    }

    await playTrack(track)
  }

  const playPreviousTrack = async (): Promise<void> => {
    if (trackHistory.value.length > 0) {
      const previousTrack = trackHistory.value[trackHistory.value.length - 1]
      
      if (!previousTrack) {
        console.log('No hay canción anterior disponible')
        return
      }
      
      trackHistory.value = trackHistory.value.slice(0, -1)
      await playTrack(previousTrack)
    } else if (currentTrack.value) {
      if (audioPlayer.value) {
        audioPlayer.value.currentTime = 0
        try {
          await audioPlayer.value.play()
          isPlaying.value = true
        } catch (error) {
          console.error("Error al reiniciar audio:", error)
        }
      }
    } else if (tracks.value.length > 0) {
      const firstTrack = tracks.value[0]
      if (firstTrack) {
        await playTrack(firstTrack)
      }
    }
  }

  const playTrack = async (track: Track): Promise<void> => {
    if (tracks.value.length === 0) {
      await loadTracks()
    }

    // ✅ CORRECCIÓN: Asegurar que el track tenga duración antes de reproducir
    if (!track.durationLoaded && track.duration === 0) {
      await loadTrackDuration(track)
      
      // Actualizar el track con la duración real
      const updatedTrack = tracks.value.find(t => t.id === track.id)
      if (updatedTrack) {
        track = updatedTrack
      }
    }

    if (currentTrack.value && currentTrack.value.id !== track.id) {
      trackHistory.value.push(currentTrack.value)
      
      if (trackHistory.value.length > 50) {
        trackHistory.value = trackHistory.value.slice(-50)
      }
    }

    const isValidSource = await checkAudioSource(track.url)
    if (!isValidSource) {
      console.error(`La fuente de audio no existe: ${track.url}`)
      setTimeout(playNextTrack, 1000)
      return
    }

    if (!audioPlayer.value) {
      initAudioPlayer()
    }

    if (audioPlayer.value) {
      audioPlayer.value.pause()
      audioPlayer.value.currentTime = 0
      
      currentTrack.value = track
      audioPlayer.value.src = track.url
      audioPlayer.value.muted = false
      isMuted.value = false
      
      try {
        if (audioPlayer.value.readyState < 2) {
          await audioPlayer.value.load()
        }
        
        await audioPlayer.value.play()
        isPlaying.value = true
        
      } catch (error) {
        console.error("Error al reproducir audio:", error)
        isPlaying.value = false
        setTimeout(playNextTrack, 1000)
      }
    }
  }

  const playRandomTrack = async (): Promise<void> => {
    if (tracks.value.length === 0) {
      await loadTracks()
    }
    
    const randomTrack = getRandomTrack()
    if (randomTrack) {
      await playTrack(randomTrack)
    }
  }

  const togglePlayback = (): void => {
    activateAudioGlobally()
    
    if (!audioPlayer.value) {
      initAudioPlayer()
      playRandomTrack()
      return
    }

    if (isPlaying.value) {
      pauseMusic()
    } else {
      if (!currentTrack.value) {
        playRandomTrack()
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

  const releaseMemory = (): void => {
    if (!isPlaying.value && audioPlayer.value) {
      audioPlayer.value.src = ''
      audioPlayer.value.load()
    }
    
    if (durationCache.value.size > 50) {
      durationCache.value.clear()
    }
  }

  const cleanup = (): void => {
    if (audioPlayer.value) {
      audioPlayer.value.pause()
      audioPlayer.value.removeEventListener('ended', handleTrackEnd)
      audioPlayer.value.removeEventListener('timeupdate', updateCurrentTime)
      audioPlayer.value.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audioPlayer.value.src = ''
      audioPlayer.value.load()
      audioPlayer.value = null
    }
    
    durationCache.value.clear()
    
    // Limpiar preload audios
    preloadAudios.forEach(audio => {
      audio.src = ''
    })
    preloadAudios.length = 0
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
    getRealDuration,
    playRandomTrack,
    loadTracks,
    releaseMemory,
    initializeAllDurations,
    loadTrackDuration
  }
})