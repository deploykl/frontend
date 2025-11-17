import { ref, onMounted } from 'vue'

export function useDarkMode() {
  const isDark = ref(false)

  // Función para aplicar/remover la clase dark
  const applyDarkMode = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyDarkMode(isDark.value)
  }

  // Establecer modo específico
  const setDarkMode = (dark: boolean) => {
    isDark.value = dark
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    applyDarkMode(dark)
  }

  // Inicializar al montar
  onMounted(() => {
    // Verificar preferencia guardada o del sistema
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark') {
      isDark.value = true
    } else if (savedTheme === 'light') {
      isDark.value = false
    } else {
      // Si no hay preferencia guardada, usar la del sistema
      isDark.value = systemPrefersDark
    }
    
    applyDarkMode(isDark.value)

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        applyDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
  })

  return {
    isDark,
    toggleDarkMode,
    setDarkMode
  }
}