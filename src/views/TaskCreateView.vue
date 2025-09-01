<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">
        Nova Tarefa
      </h1>
      <p class="text-muted-foreground">
        Cadastre uma nova tarefa com controle de prazos, responsáveis e prioridades
      </p>
    </div>

    <div class="bg-card border border-border rounded-lg p-6">
      <TaskForm
        @cancel="handleCancel"
        @created="handleCreated"
      />
    </div>

    <!-- Lista de Tarefas Recentes -->
    <div v-if="recentTasks.length > 0" class="mt-12">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold text-foreground">
          Tarefas Recentes
        </h2>
        <div class="text-sm text-muted-foreground">
          {{ recentTasks.length }} de {{ taskStore.tasks.length }} tarefas
        </div>
      </div>
      <div class="grid gap-4">
        <div
          v-for="task in recentTasks"
          :key="task.id"
          class="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="font-medium text-foreground">
                  {{ task.nome }}
                </h3>
                <span v-if="task.urgente" class="text-red-600 font-medium text-xs bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">
                  URGENTE
                </span>
                <span v-if="task.paralelo" class="text-blue-600 font-medium text-xs bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded">
                  PARALELO
                </span>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-2">
                <div>
                  <span class="font-medium">Responsável:</span>
                  <span :class="getRoleColor(task.responsavel)" class="ml-1 px-2 py-1 rounded-full text-xs">
                    {{ task.responsavel }}
                  </span>
                </div>
                <div>
                  <span class="font-medium">Gerente:</span>
                  <span class="ml-1">{{ task.gerente }}</span>
                </div>
                <div>
                  <span class="font-medium">Prazo:</span>
                  <span class="ml-1">{{ task.prazoDias }} dias</span>
                </div>
                <div v-if="task.prioridade">
                  <span class="font-medium">Prioridade:</span>
                  <span class="ml-1">{{ task.prioridade }}</span>
                </div>
              </div>
              
              <div class="flex items-center gap-4 text-sm">
                <div>
                  <span class="font-medium">Período:</span>
                  <span class="ml-1">{{ formatDate(task.dataInicio) }} → {{ formatDate(task.dataFim) }}</span>
                </div>
                <span :class="getStatusColor(task.status)" class="px-2 py-1 rounded-full text-xs">
                  {{ task.status }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <Button
                v-if="task.link"
                variant="outline"
                size="default"
                @click="openLink(task.link)"
                title="Abrir link"
              >
                <ExternalLink class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import  Button from '@/components/ui/Button.vue'
import  TaskForm  from '@/components/forms/TaskForm.vue'
import { useTaskStore } from '@/stores/task.store'
import { formatDate, getStatusColor, getRoleColor } from '@/utils/date'
import { ExternalLink } from 'lucide-vue-next'

const router = useRouter()
const taskStore = useTaskStore()

const recentTasks = computed(() => {
  return taskStore.tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

function handleCancel() {
  router.push('/')
}

function handleCreated(task: any) {
  // Opcional: redirecionar para o quadro Kanban ou calendário
  // router.push('/kanban')
}

function openLink(link: string) {
  if (link) {
    window.open(link, '_blank')
  }
}

onMounted(async () => {
  if (taskStore.tasks.length === 0) {
    await taskStore.loadTasks()
  }
})
</script>
