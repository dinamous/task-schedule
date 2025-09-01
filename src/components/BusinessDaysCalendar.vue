<template>
  <div class="space-y-6">
    <!-- Estatísticas de alocação -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Tarefas</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ allocationStats.totalTasks }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Dias Úteis</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ allocationStats.totalBusinessDays }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Média por Dia</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ allocationStats.averageTasksPerDay.toFixed(1) }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Conflitos</div>
        <div class="text-2xl font-bold text-red-600">{{ allocationStats.conflicts }}</div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-4 items-center">
      <div class="flex items-center gap-2">
        <Label for="responsavel-filter">Responsável:</Label>
        <Select
          id="responsavel-filter"
          :value="selectedResponsavel"
          @change="(e: Event) => selectedResponsavel = (e.target as HTMLSelectElement).value"
          class="w-40"
        >
          <option value="">Todos</option>
          <option v-for="responsavel in Object.keys(tasksByResponsavel)" :key="responsavel" :value="responsavel">
            {{ responsavel }}
          </option>
        </Select>
      </div>
      
      <div class="flex items-center gap-2">
        <Checkbox
          id="show-weekends"
          :checked="showWeekends"
          @change="(e: Event) => showWeekends = (e.target as HTMLInputElement).checked"
        >
          Mostrar fins de semana
        </Checkbox>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        @click="reallocateSelected"
        :disabled="!selectedResponsavel"
      >
        Reorganizar Agenda
      </Button>
    </div>

    <!-- Calendário de dias úteis -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border shadow-sm overflow-hidden">
      <div class="p-4 border-b bg-gray-50 dark:bg-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Calendário de Dias Úteis
        </h3>
      </div>
      
      <div v-if="businessDaysCalendar.length === 0" class="p-8 text-center text-gray-500">
        <p>Nenhuma tarefa encontrada. Crie uma tarefa para ver o calendário.</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <div class="min-w-full">
          <!-- Cabeçalho -->
          <div class="grid grid-cols-7 bg-gray-100 dark:bg-gray-700 border-b">
            <div class="p-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Dom</div>
            <div class="p-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Seg</div>
            <div class="p-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Ter</div>
            <div class="p-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Qua</div>
            <div class="p-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Qui</div>
            <div class="p-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Sex</div>
            <div class="p-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Sáb</div>
          </div>
          
          <!-- Semanas -->
          <div v-for="(week, weekIndex) in calendarWeeks" :key="`week-${weekIndex}`" class="grid grid-cols-7 border-b last:border-b-0">
            <div
              v-for="day in week"
              :key="day.date"
              class="min-h-[120px] p-2 border-r last:border-r-0"
              :class="{
                'bg-gray-50 dark:bg-gray-800': day.isWeekend,
                'bg-white dark:bg-gray-900': !day.isWeekend
              }"
            >
              <!-- Data -->
              <div class="text-sm font-medium mb-2 text-center">
                <span
                  :class="{
                    'text-gray-400': day.isWeekend,
                    'text-gray-900 dark:text-white': !day.isWeekend
                  }"
                >
                  {{ formatDayNumber(day.date) }}
                </span>
              </div>
              
              <!-- Tarefas do dia -->
              <div class="space-y-1">
                <div
                  v-for="task in day.tasks"
                  :key="task.id"
                  class="text-xs p-1 rounded cursor-pointer transition-colors"
                  :class="getTaskClasses(task)"
                  @click="handleTaskClick(task)"
                  :title="`${task.nome} - ${task.responsavel}`"
                >
                  <div class="font-medium truncate">{{ task.nome }}</div>
                  <div class="text-xs opacity-75">{{ task.responsavel }}</div>
                  <div v-if="task.urgente" class="text-xs font-bold text-red-600">🚨</div>
                </div>
                
                <!-- Indicador de múltiplas tarefas -->
                <div
                  v-if="day.tasks.length > 3"
                  class="text-xs text-gray-500 text-center py-1"
                >
                  +{{ day.tasks.length - 3 }} mais
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estatísticas por responsável -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
      <div class="p-4 border-b bg-gray-50 dark:bg-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Estatísticas por Responsável
        </h3>
      </div>
      
      <div class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="[responsavel, stats] in Object.entries(allocationStats.byResponsavel)"
            :key="responsavel"
            class="p-4 border rounded-lg"
            :class="{
              'border-red-200 bg-red-50 dark:bg-red-900/20': stats.conflicts > 0,
              'border-green-200 bg-green-50 dark:bg-green-900/20': stats.conflicts === 0
            }"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold text-gray-900 dark:text-white">{{ responsavel }}</h4>
              <span
                v-if="stats.conflicts > 0"
                class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
              >
                {{ stats.conflicts }} conflitos
              </span>
            </div>
            
            <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div>Total: {{ stats.total }} tarefas</div>
              <div>Dias úteis: {{ stats.businessDays }}</div>
              <div>Média por dia: {{ stats.averagePerDay.toFixed(1) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBusinessDaysRendering, type BusinessDayTask } from '@/composables/useBusinessDaysRendering'
import { useTaskStore } from '@/stores/task.store'
import type { Task, Role } from '@/types/task'
import Button from '@/components/ui/Button.vue'
import Select from '@/components/ui/Select.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Label from '@/components/ui/Label.vue'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  taskClick: [task: Task]
}>()

const taskStore = useTaskStore()

// Estado local
const selectedResponsavel = ref('')
const showWeekends = ref(false)

// Composable para renderização de dias úteis
const {
  businessDaysCalendar,
  tasksByResponsavel,
  allocationStats,
} = useBusinessDaysRendering(props.tasks)

// Filtrar calendário baseado na seleção
const filteredCalendar = computed(() => {
  if (!selectedResponsavel.value) {
    return businessDaysCalendar.value
  }
  
  return businessDaysCalendar.value.map(day => ({
    ...day,
    tasks: day.tasks.filter(task => task.responsavel === selectedResponsavel.value)
  }))
})

// Organizar em semanas para exibição
const calendarWeeks = computed(() => {
  if (filteredCalendar.value.length === 0) return []
  
  // Ordenar por data
  const sortedDays = [...filteredCalendar.value].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  
  const weeks: BusinessDayTask[][] = []
  let currentWeek: BusinessDayTask[] = []
  
  sortedDays.forEach(day => {
    const date = new Date(day.date)
    const dayOfWeek = date.getDay()
    
    // Se começar uma nova semana (domingo) e já temos dias na semana atual
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    
    currentWeek.push(day)
    
    // Se for sábado, finalizar a semana
    if (dayOfWeek === 6) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  
  // Adicionar última semana se não estiver completa
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }
  
  return weeks
})

// Funções auxiliares
function formatDayNumber(dateStr: string): string {
  const date = new Date(dateStr)
  return date.getDate().toString()
}

function getTaskClasses(task: Task): string {
  const baseClasses = 'hover:opacity-80'
  
  if (task.urgente) {
    return `${baseClasses} bg-red-100 text-red-800 border border-red-200`
  }
  
  if (task.status === 'APROVADO') {
    return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
  }
  
  if (task.status === 'BLOQUEADO') {
    return `${baseClasses} bg-gray-100 text-gray-600 border border-gray-200`
  }
  
  if (task.paralelo) {
    return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`
  }
  
  return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`
}

function handleTaskClick(task: Task) {
  emit('taskClick', task)
}

async function reallocateSelected() {
  if (!selectedResponsavel.value) return
  
  try {
            await taskStore.reallocateFor(selectedResponsavel.value as Role)
  } catch (error) {
    console.error('Erro ao reorganizar agenda:', error)
  }
}
</script>
