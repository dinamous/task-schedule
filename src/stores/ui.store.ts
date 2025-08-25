import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isDarkMode = ref(false)
  const sidebarOpen = ref(false)
  const currentView = ref<'kanban' | 'calendar' | 'create' | 'logs'>('kanban')

  // Computed
  const theme = computed(() => isDarkMode.value ? 'dark' : 'light')

  // Actions
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    updateThemeClass()
  }

  function setDarkMode(dark: boolean) {
    isDarkMode.value = dark
    updateThemeClass()
  }

  function updateThemeClass() {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setSidebarOpen(open: boolean) {
    sidebarOpen.value = open
  }

  function setCurrentView(view: typeof currentView.value) {
    currentView.value = view
  }

  return {
    // State
    isDarkMode: readonly(isDarkMode),
    sidebarOpen: readonly(sidebarOpen),
    currentView: readonly(currentView),
    
    // Computed
    theme,
    
    // Actions
    toggleDarkMode,
    setDarkMode,
    updateThemeClass,
    toggleSidebar,
    setSidebarOpen,
    setCurrentView
  }
})
