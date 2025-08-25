import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isDarkMode = ref(false)
  const sidebarOpen = ref(false)
  const currentView = ref<'kanban' | 'calendar' | 'create' | 'logs'>('kanban')
  const notifications = ref<Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }>>([])

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

  function addNotification(notification: Omit<typeof notifications.value[0], 'id'>) {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    notifications.value.push(newNotification)
    
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearNotifications() {
    notifications.value = []
  }

  return {
    // State
    isDarkMode: readonly(isDarkMode),
    sidebarOpen: readonly(sidebarOpen),
    currentView: readonly(currentView),
    notifications: readonly(notifications),
    
    // Computed
    theme,
    
    // Actions
    toggleDarkMode,
    setDarkMode,
    updateThemeClass,
    toggleSidebar,
    setSidebarOpen,
    setCurrentView,
    addNotification,
    removeNotification,
    clearNotifications
  }
})
