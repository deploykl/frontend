import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const mobileSidebarOpen = ref(false)

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const toggleMobileSidebar = () => {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
  }

  const closeMobileSidebar = () => {
    mobileSidebarOpen.value = false
  }

  return {
    sidebarCollapsed,
    mobileSidebarOpen,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar
  }
})