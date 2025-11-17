import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  // Función para aplicar/remover la clase dark
  const applyDarkMode = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark')
      console.log('🌙 Modo oscuro activado')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('☀️ Modo claro activado')
    }
    isDark.value = dark
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDark.value
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
    applyDarkMode(newDarkMode)
  }

  // Establecer modo específico
  const setDarkMode = (dark: boolean) => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    applyDarkMode(dark)
  }

  // Inicializar al montar
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    let initialDarkMode = false
    
    if (savedTheme === 'dark') {
      initialDarkMode = true
    } else if (savedTheme === 'light') {
      initialDarkMode = false
    } else {
      initialDarkMode = systemPrefersDark
    }
    
    console.log('Initial theme:', { savedTheme, systemPrefersDark, initialDarkMode })
    applyDarkMode(initialDarkMode)

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyDarkMode(e.matches)
      }
    })
  }

  return {
    isDark,
    toggleDarkMode,
    setDarkMode,
    initializeTheme
  }
})