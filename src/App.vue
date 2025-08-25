<script setup lang="ts">
import { computed } from 'vue'
import { Sun, Moon, Menu, X } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui.store'
import { useTheme } from '@/composables/useTheme'
import HomeView from '@/views/HomeView.vue'

const uiStore = useUIStore()
const { isDark, toggleTheme } = useTheme()

const sidebarOpen = computed(() => uiStore.sidebarOpen)

function toggleSidebar() {
  uiStore.toggleSidebar()
}

function closeSidebar() {
  uiStore.setSidebarOpen(false)
}
</script>

<template>
  <div id="app" class="min-h-screen bg-background">
    <header class="border-b border-border bg-card">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-foreground">Task Schedule</h1>
            <nav class="hidden md:flex space-x-6">
              <a href="#" class="text-muted-foreground hover:text-foreground transition-colors">
                Quadro Kanban
              </a>
              <a href="#" class="text-muted-foreground hover:text-foreground transition-colors">
                Calendário
              </a>
              <a href="#" class="text-muted-foreground hover:text-foreground transition-colors">
                Nova Tarefa
              </a>
            </nav>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="toggleTheme"
              class="p-2 rounded-md hover:bg-accent transition-colors"
              :title="isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
            >
              <Sun v-if="isDark" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </button>
            
            <button
              @click="toggleSidebar"
              class="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            >
              <Menu class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar mobile -->
    <div v-if="sidebarOpen" class="md:hidden fixed inset-0 z-50">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeSidebar"></div>
      <div class="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold">Menu</h2>
          <button @click="closeSidebar" class="p-1 rounded-md hover:bg-accent">
            <X class="w-5 h-5" />
          </button>
        </div>
        <nav class="space-y-2">
          <a href="#" class="block px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            Quadro Kanban
          </a>
          <a href="#" class="block px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            Calendário
          </a>
          <a href="#" class="block px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            Nova Tarefa
          </a>
        </nav>
      </div>
    </div>

    <main class="container mx-auto px-4 py-6">
      <HomeView />
    </main>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
