<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">
          Calendário de Dias Úteis
        </h1>
        <p class="text-muted-foreground mt-2">
          Visualize e gerencie tarefas considerando apenas dias úteis
        </p>
      </div>
      
      <div class="flex gap-2">
        <Button
          variant="outline"
          @click="refreshData"
          :disabled="isLoading"
        >
          <RefreshCw class="w-4 h-4 mr-2" />
          {{ isLoading ? 'Atualizando...' : 'Atualizar' }}
        </Button>
        
        <router-link to="/create">
          <Button>
            <Plus class="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </router-link>
      </div>
    </div>

    <!-- Calendário de dias úteis -->
    <BusinessDaysCalendar
      :tasks="[...tasks]"
      @task-click="handleTaskClick"
    />

    <!-- Modal de detalhes da tarefa -->
    <div
      v-if="selectedTask"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeTaskModal"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Detalhes da Tarefa
          </h3>
          <Button
            variant="ghost"
            size="sm"
            @click="closeTaskModal"
          >
            <X class="w-4 h-4" />
          </Button>
        </div>
        
        <div class="space-y-3">
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Nome:</span>
            <p class="text-gray-900 dark:text-white">{{ selectedTask.nome }}</p>
          </div>
          
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Responsável:</span>
            <p class="text-gray-900 dark:text-white">{{ selectedTask.responsavel }}</p>
          </div>
          
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
            <p class="text-gray-900 dark:text-white">{{ selectedTask.status }}</p>
          </div>
          
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Prazo:</span>
            <p class="text-gray-900 dark:text-white">
              {{ selectedTask.prazoDias }} dias úteis
            </p>
          </div>
          
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Período:</span>
            <p class="text-gray-900 dark:text-white">
              {{ formatDate(selectedTask.dataInicio) }} → {{ formatDate(selectedTask.dataFim) }}
            </p>
          </div>
          
          <div v-if="selectedTask.link">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Link:</span>
            <a
              :href="selectedTask.link"
              target="_blank"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm block truncate"
            >
              {{ selectedTask.link }}
            </a>
          </div>
        </div>
        
        <div class="flex gap-2 mt-6">
          <Button
            variant="outline"
            @click="editTask"
            class="flex-1"
          >
            <Edit class="w-4 h-4 mr-2" />
            Editar
          </Button>
          
          <Button
            variant="outline"
            @click="viewInBoard"
            class="flex-1"
          >
            <Kanban class="w-4 h-4 mr-2" />
            Ver no Quadro
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task.store'
import { useUIStore } from '@/stores/ui.store'
import { formatDate } from '@/utils/date'
import type { Task } from '@/types/task'
import BusinessDaysCalendar from '@/components/BusinessDaysCalendar.vue'
import Button from '@/components/ui/Button.vue'
import { RefreshCw, Plus, X, Edit, Kanban } from 'lucide-vue-next'

const router = useRouter()
const taskStore = useTaskStore()
const uiStore = useUIStore()

// Estado local
const selectedTask = ref<Task | null>(null)
const isLoading = ref(false)

// Computed properties
const tasks = computed(() => taskStore.tasks)

// Funções
async function refreshData() {
  isLoading.value = true
  
  try {
    await taskStore.loadTasks()
    uiStore.addNotification({
      type: 'success',
      message: 'Dados atualizados com sucesso',
      duration: 3000
    })
  } catch (error) {
    uiStore.addNotification({
      type: 'error',
      message: 'Erro ao atualizar dados',
      duration: 5000
    })
  } finally {
    isLoading.value = false
  }
}

function handleTaskClick(task: Task) {
  selectedTask.value = task
}

function closeTaskModal() {
  selectedTask.value = null
}

function editTask() {
  if (!selectedTask.value) return
  
  // Carregar tarefa para edição
  const success = taskStore.loadTaskForEditing(selectedTask.value.id)
  
  if (success) {
    closeTaskModal()
    router.push('/create')
  } else {
    uiStore.addNotification({
      type: 'error',
      message: 'Erro ao carregar tarefa para edição',
      duration: 5000
    })
  }
}

function viewInBoard() {
  closeTaskModal()
  router.push('/board')
}

// Carregar dados ao montar
onMounted(async () => {
  if (taskStore.tasks.length === 0) {
    await taskStore.loadTasks()
  }
})
</script>
