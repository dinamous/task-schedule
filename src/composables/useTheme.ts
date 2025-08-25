import { onMounted, watch } from 'vue'
import { useUIStore } from '@/stores/ui.store'

export function useTheme() {
  const uiStore = useUIStore()

  onMounted(() => {
    // Verificar preferência salva ou do sistema
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      uiStore.setDarkMode(savedTheme === 'dark')
    } else {
      uiStore.setDarkMode(systemPrefersDark)
    }
    
    uiStore.updateThemeClass()
  })

  // Observar mudanças no tema
  watch(() => uiStore.isDarkMode, (isDark) => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    uiStore.updateThemeClass()
  })

  // Observar mudanças na preferência do sistema
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        uiStore.setDarkMode(e.matches)
      }
    })
  }

  return {
    isDark: uiStore.isDarkMode,
    theme: uiStore.theme,
    toggleTheme: uiStore.toggleDarkMode,
    setTheme: uiStore.setDarkMode
  }
}
