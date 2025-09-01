<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">
        Quadro Kanban
      </h1>
      <p class="text-muted-foreground">
        Visualize e gerencie tarefas por status com drag & drop
      </p>
    </div>

    <!-- Filtros -->
    <div class="mb-6 p-4 bg-card border border-border rounded-lg">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <Label for="filterResponsavel">Responsável:</Label>
          <Select 
            id="filterResponsavel" 
            v-model="filterResponsavel"
            class="w-40"
          >
            <option value="">Todos</option>
            <option value="DEV">DEV</option>
            <option value="QA">QA</option>
            <option value="UX">UX</option>
            <option value="DESIGNER">DESIGNER</option>
            <option value="PM">PM</option>
            <option value="PO">PO</option>
          </Select>
        </div>
        
        <div class="flex items-center gap-2">
          <Label for="filterUrgente">Urgente:</Label>
          <Checkbox
            id="filterUrgente"
            v-model:checked="filterUrgente"
          />
        </div>
        
        <Button
          variant="outline"
          size="default"
          @click="clearFilters"
        >
          Limpar Filtros
        </Button>
      </div>
    </div>

    <!-- Quadro Kanban -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Coluna: A FAZER -->
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-foreground">A FAZER</h3>
          <span class="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {{ getFilteredTasks('A FAZER').length }}
          </span>
        </div>
        
        <div
          class="min-h-[400px] space-y-3"
          @drop="onDrop($event, 'A FAZER')"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="task in getFilteredTasks('A FAZER')"
            :key="task.id"
            class="bg-background border border-border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
            draggable="true"
            @dragstart="onDragStart($event, task)"
          >
            <TaskCard :task="task" />
          </div>
        </div>
      </div>

      <!-- Coluna: FAZENDO -->
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-foreground">FAZENDO</h3>
          <span class="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {{ getFilteredTasks('FAZENDO').length }}
          </span>
        </div>
        
        <div
          class="min-h-[400px] space-y-3"
          @drop="onDrop($event, 'FAZENDO')"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="task in getFilteredTasks('FAZENDO')"
            :key="task.id"
            class="bg-background border border-border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
            draggable="true"
            @dragstart="onDragStart($event, task)"
          >
            <TaskCard :task="task" />
          </div>
        </div>
      </div>

      <!-- Coluna: AGUARDANDO APROVAÇÃO -->
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-foreground">AGUARDANDO APROVAÇÃO</h3>
          <span class="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {{ getFilteredTasks('AGUARDANDO APROVAÇÃO').length }}
          </span>
        </div>
        
        <div
          class="min-h-[400px] space-y-3"
          @drop="onDrop($event, 'AGUARDANDO APROVAÇÃO')"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="task in getFilteredTasks('AGUARDANDO APROVAÇÃO')"
            :key="task.id"
            class="bg-background border border-border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
            draggable="true"
            @dragstart="onDragStart($event, task)"
          >
            <TaskCard :task="task" />
          </div>
        </div>
      </div>

      <!-- Coluna: QA -->
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-foreground">QA</h3>
          <span class="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {{ getFilteredTasks('QA').length }}
          </span>
        </div>
        
        <div
          class="min-h-[400px] space-y-3"
          @drop="onDrop($event, 'QA')"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="task in getFilteredTasks('QA')"
            :key="task.id"
            class="bg-background border border-border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
            draggable="true"
            @dragstart="onDragStart($event, task)"
          >
            <TaskCard :task="task" />
          </div>
        </div>
      </div>

      <!-- Coluna: APROVADO -->
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-foreground">APROVADO</h3>
          <span class="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {{ getFilteredTasks('APROVADO').length }}
          </span>
        </div>
        
        <div
          class="min-h-[400px] space-y-3"
          @drop="onDrop($event, 'APROVADO')"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="task in getFilteredTasks('APROVADO')"
            :key="task.id"
            class="bg-background border border-border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
            draggable="true"
            @dragstart="onDragStart($event, task)"
          >
            <TaskCard :task="task" />
          </div>
        </div>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="text-2xl font-bold text-foreground">{{ totalTasks }}</div>
        <div class="text-sm text-muted-foreground">Total de Tarefas</div>
      </div>
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="text-2xl font-bold text-blue-600">{{ getFilteredTasks('FAZENDO').length }}</div>
        <div class="text-sm text-muted-foreground">Em Progresso</div>
      </div>
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="text-2xl font-bold text-yellow-600">{{ getFilteredTasks('AGUARDANDO APROVAÇÃO').length }}</div>
        <div class="text-sm text-muted-foreground">Aguardando</div>
      </div>
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="text-2xl font-bold text-green-600">{{ getFilteredTasks('APROVADO').length }}</div>
        <div class="text-sm text-muted-foreground">Aprovadas</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task.store'
import { useUIStore } from '@/stores/ui.store'
import Button from '@/components/ui/Button.vue'
import Select from '@/components/ui/Select.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Label from '@/components/ui/Label.vue'
import TaskCard from '@/components/TaskCard.vue'
import type { Task, TaskStatus } from '@/types/task'

const taskStore = useTaskStore()
const uiStore = useUIStore()

// Filtros
const filterResponsavel = ref('')
const filterUrgente = ref(false)

// Estado do drag & drop
const draggedTask = ref<Task | null>(null)

// Computed properties
const totalTasks = computed(() => taskStore.tasks.length)

function getFilteredTasks(status: TaskStatus): Task[] {
  let tasks = taskStore.tasks.filter(task => task.status === status)
  
  if (filterResponsavel.value) {
    tasks = tasks.filter(task => task.responsavel === filterResponsavel.value)
  }
  
  if (filterUrgente.value) {
    tasks = tasks.filter(task => task.urgente)
  }
  
  // Ordenar por prioridade e data de criação
  return tasks.sort((a, b) => {
    if (a.prioridade !== b.prioridade) {
      return (a.prioridade || 999) - (b.prioridade || 999)
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}

function clearFilters() {
  filterResponsavel.value = ''
  filterUrgente.value = false
}

// Drag & Drop handlers
function onDragStart(event: DragEvent, task: Task) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', task.id)
    event.dataTransfer.effectAllowed = 'move'
    draggedTask.value = task
  }
}

async function onDrop(event: DragEvent, newStatus: TaskStatus) {
  event.preventDefault()
  
  if (!draggedTask.value) return
  
  const taskId = draggedTask.value.id
  const oldStatus = draggedTask.value.status
  
  if (oldStatus === newStatus) {
    draggedTask.value = null
    return
  }
  
  try {
    // Atualizar status da tarefa na store
    await taskStore.moveStatus(taskId, newStatus)
    
    uiStore.addNotification({
      type: 'success',
      message: `Tarefa "${draggedTask.value.nome}" movida de "${oldStatus}" para "${newStatus}"`,
      duration: 3000
    })
    
    // Registrar no log
    await taskStore.addLog({
      taskId,
      action: 'status_changed',
      description: `Tarefa movida de "${oldStatus}" para "${newStatus}" via drag & drop`,
      metadata: { oldStatus, newStatus, method: 'drag_drop' }
    })
    
  } catch (error) {
    console.error('Erro ao mover tarefa:', error)
    
    uiStore.addNotification({
      type: 'error',
      message: error instanceof Error ? error.message : 'Erro ao mover tarefa',
      duration: 5000
    })
  } finally {
    draggedTask.value = null
  }
}

onMounted(async () => {
  if (taskStore.tasks.length === 0) {
    await taskStore.loadTasks()
  }
})
</script>
