<template>
  <div class="space-y-6 p-6">
    <h1 class="text-3xl font-bold">Teste do Calendário de Dias Úteis</h1>
    
    <div v-if="tasks.length === 0" class="text-center p-8">
      <p class="text-gray-500 mb-4">Nenhuma tarefa encontrada para exibir no calendário.</p>
      <router-link to="/create">
        <Button>Criar Primeira Tarefa</Button>
      </router-link>
    </div>
    
    <div v-else>
      <p class="text-gray-600 mb-4">{{ tasks.length }} tarefa(s) encontrada(s)</p>
      
      <!-- Lista simples de tarefas -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Tarefas Cadastradas:</h2>
        <div class="space-y-2">
          <div 
            v-for="task in tasks" 
            :key="task.id"
            class="p-3 border rounded-lg bg-gray-50"
          >
            <div class="font-medium">{{ task.nome }}</div>
            <div class="text-sm text-gray-600">
              {{ task.responsavel }} • {{ formatDate(task.dataInicio) }} → {{ formatDate(task.dataFim) }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Componente do calendário -->
      <BusinessDaysCalendar
        :tasks="[...tasks]"
        @task-click="handleTaskClick"
      />
    </div>
    
    <!-- Modal simples -->
    <div v-if="selectedTask" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">{{ selectedTask.nome }}</h3>
        <p class="text-gray-600 mb-4">Responsável: {{ selectedTask.responsavel }}</p>
        <Button @click="selectedTask = null">Fechar</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '@/stores/task.store'
import { formatDate } from '@/utils/date'
import type { Task } from '@/types/task'
import BusinessDaysCalendar from '@/components/BusinessDaysCalendar.vue'
import Button from '@/components/ui/Button.vue'

const taskStore = useTaskStore()
const selectedTask = ref<Task | null>(null)

const tasks = computed(() => taskStore.tasks)

function handleTaskClick(task: Task) {
  selectedTask.value = task
}

onMounted(async () => {
  await taskStore.loadTasks()
})
</script>
