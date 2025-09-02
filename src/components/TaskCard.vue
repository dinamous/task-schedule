<template>
  <div class="space-y-3">
    <!-- Cabeçalho do Card -->
    <div class="flex items-start justify-between">
      <h4 class="font-medium text-foreground text-sm leading-tight line-clamp-2">
        {{ task.nome }}
      </h4>
      
      <!-- Badges de Status -->
      <div class="flex flex-col gap-1 ml-2">
        <span v-if="task.urgente" class="text-red-600 text-xs font-medium bg-red-100 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
          URGENTE
        </span>
        <span v-if="task.paralelo" class="text-blue-600 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
          PARALELO
        </span>
      </div>
    </div>

    <!-- Responsável e Gerente -->
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground">👤</span>
        <span :class="getRoleColor(task.responsavel)" class="text-xs px-2 py-1 rounded-full">
          {{ task.responsavel }}
        </span>
      </div>
      
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground">👨‍💼</span>
        <span class="text-xs text-foreground">{{ task.gerente }}</span>
      </div>
    </div>

    <!-- Prazo e Datas -->
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground">⏰</span>
        <span class="text-xs text-foreground">
          {{ task.prazoDias }} dias úteis
        </span>
      </div>
      
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground">📅</span>
        <span class="text-xs text-foreground">
          {{ formatDate(task.dataInicio) }} → {{ formatDate(task.dataFim) }}
        </span>
      </div>
    </div>

    <!-- Prioridade -->
    <div v-if="task.prioridade" class="flex items-center gap-2">
      <span class="text-xs text-muted-foreground">🎯</span>
      <span class="text-xs text-foreground">
        Prioridade: {{ task.prioridade }}
      </span>
    </div>

    <!-- Link -->
    <div v-if="task.link" class="flex items-center gap-2">
      <span class="text-xs text-muted-foreground">🔗</span>
      <a 
        :href="task.link" 
        target="_blank" 
        class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate"
        title="Abrir link"
      >
        {{ task.link }}
      </a>
    </div>

    <!-- Ações Rápidas -->
    <div class="flex items-center gap-2 pt-2 border-t border-border">
      <Button
        v-if="task.link"
        variant="ghost"
        size="default"
        class="h-6 px-2 text-xs"
        @click="openLink(task.link)"
        title="Abrir link"
      >
        <ExternalLink class="w-3 h-3" />
      </Button>
      
      <Button
        variant="ghost"
        size="default"
        class="h-6 px-2 text-xs"
        @click="editTask(task)"
        title="Editar tarefa"
      >
        <Edit class="w-3 h-3" />
      </Button>
      
      <Button
        variant="ghost"
        size="default"
        class="h-6 px-2 text-xs text-red-600 hover:text-red-700"
        @click="deleteTask(task.id)"
        title="Excluir tarefa"
      >
        <Trash2 class="w-3 h-3" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/task.store'
import { useUIStore } from '@/stores/ui.store'
import Button from '@/components/ui/Button.vue'
import { ExternalLink, Edit, Trash2 } from 'lucide-vue-next'
import { formatDate, getRoleColor } from '@/utils/date'
import type { Task } from '@/types/task'

interface Props {
  task: Task
}

const emit = defineEmits<{
  edit: [task: Task]
}>()

defineProps<Props>()
const taskStore = useTaskStore()
const uiStore = useUIStore()

function openLink(link: string) {
  if (link) {
    window.open(link, '_blank')
  }
}

function editTask(task: Task) {
  // Carregar tarefa para edição
  const success = taskStore.loadTaskForEditing(task.id)
  
  if (success) {
    uiStore.addNotification({
      type: 'info',
      message: `Editando tarefa: ${task.nome}`,
      duration: 3000
    })
    
    // Emitir evento para abrir formulário de edição
    // O componente pai deve escutar este evento
    emit('edit', task)
  } else {
    uiStore.addNotification({
      type: 'error',
      message: 'Erro ao carregar tarefa para edição',
      duration: 5000
    })
  }
}

async function deleteTask(taskId: string) {
  if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
    return
  }
  
  try {
    await taskStore.deleteTask(taskId)
    
    uiStore.addNotification({
      type: 'success',
      message: 'Tarefa excluída com sucesso',
      duration: 3000
    })
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error)
    
    uiStore.addNotification({
      type: 'error',
      message: error instanceof Error ? error.message : 'Erro ao excluir tarefa',
      duration: 5000
    })
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
