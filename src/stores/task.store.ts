import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { Task, TaskCreateInput, TaskUpdateInput, TaskStatus, Role } from '@/types/task'
import type { LogEntry, LogCreateInput } from '@/types/log'
import { generateId } from '@/utils/ids'
import { persistToStorage, loadFromStorage } from '@/utils/persist'
import { logger } from '@/utils/logger'
import { calculateDataFim, getNextBusinessDay, addBusinessDays } from '@/utils/date'

const TASKS_STORAGE_KEY = 'tasks'
const LOGS_STORAGE_KEY = 'task_logs'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const logs = ref<LogEntry[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const byResponsavel = computed(() => {
    return (responsavel: Role) => {
      return tasks.value
        .filter(task => task.responsavel === responsavel)
        .sort((a, b) => {
          // Ordenar por data de início
          return new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
        })
    }
  })

  const calendarEvents = computed(() => {
    return tasks.value.map(task => ({
      id: task.id,
      title: task.nome,
      start: task.dataInicio,
      end: task.dataFim,
      allDay: true,
      backgroundColor: getEventColor(task.status, task.urgente),
      borderColor: getEventColor(task.status, task.urgente),
      textColor: '#ffffff',
      extendedProps: {
        task,
        status: task.status,
        responsavel: task.responsavel,
        urgente: task.urgente
      }
    }))
  })

  const kanbanColumns = computed(() => {
    const columns: Record<TaskStatus, Task[]> = {
      'A FAZER': [],
      'FAZENDO': [],
      'AGUARDANDO APROVAÇÃO': [],
      'QA': [],
      'APROVADO': [],
      'BLOQUEADO': [],
      'URGENTE': []
    }
    
    tasks.value.forEach(task => {
      columns[task.status].push(task)
    })
    
    // Ordenar por prioridade (menor = mais prioritária) e data de início
    Object.keys(columns).forEach(status => {
      columns[status as TaskStatus].sort((a, b) => {
        if (a.prioridade !== b.prioridade) {
          return (a.prioridade || 999) - (b.prioridade || 999)
        }
        return new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
      })
    })
    
    return columns
  })

  // Actions
  async function loadTasks() {
    isLoading.value = true
    error.value = null
    
    try {
      const storedTasks = await loadFromStorage<Task[]>(TASKS_STORAGE_KEY, [])
      const storedLogs = await loadFromStorage<LogEntry[]>(LOGS_STORAGE_KEY, [])
      
      tasks.value = storedTasks
      logs.value = storedLogs
    } catch (err) {
      error.value = 'Erro ao carregar tarefas'
      logger.error('Erro ao carregar tarefas', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(input: TaskCreateInput): Promise<Task> {
    const dataFim = calculateDataFim(input.dataInicio, input.prazoDias)
    
    // Aplicar alocação padrão se não for paralela
    let dataInicioFinal = input.dataInicio
    if (!input.paralelo) {
      dataInicioFinal = await calculateNextAvailableSlot(input.responsavel, input.dataInicio, input.prazoDias)
    }
    
    const task: Task = {
      id: generateId(),
      nome: input.nome,
      link: input.link,
      dataInicio: dataInicioFinal,
      prazoDias: input.prazoDias,
      dataFim: calculateDataFim(dataInicioFinal, input.prazoDias),
      responsavel: input.responsavel,
      gerente: input.gerente,
      status: input.status || 'A FAZER',
      prioridade: input.prioridade,
      urgente: input.urgente || false,
      paralelo: input.paralelo || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    tasks.value.push(task)
    await persistTasks()
    
    // Registrar log
    await addLog({
      taskId: task.id,
      action: 'task_created',
      description: `Tarefa "${task.nome}" criada`,
      metadata: { task }
    })
    
    logger.info('Tarefa criada', { taskId: task.id, nome: task.nome })
    return task
  }

  async function updateTask(id: string, input: TaskUpdateInput): Promise<Task | null> {
    const taskIndex = tasks.value.findIndex(t => t.id === id)
    if (taskIndex === -1) return null

    const oldTask = { ...tasks.value[taskIndex] }
    const updatedTask = {
      ...oldTask,
      ...input,
      updatedAt: new Date().toISOString()
    }

    // Recalcular dataFim se prazoDias ou dataInicio mudaram
    if (input.prazoDias !== undefined || input.dataInicio !== undefined) {
      const newDataInicio = input.dataInicio || oldTask.dataInicio
      const newPrazoDias = input.prazoDias || oldTask.prazoDias
      updatedTask.dataFim = calculateDataFim(newDataInicio, newPrazoDias)
    }

    tasks.value[taskIndex] = updatedTask
    await persistTasks()
    
    // Registrar log de diferenças
    const changes = Object.keys(input).filter(key => input[key as keyof TaskUpdateInput] !== oldTask[key as keyof Task])
    if (changes.length > 0) {
      await addLog({
        taskId: id,
        action: 'task_updated',
        description: `Tarefa atualizada: ${changes.join(', ')}`,
        metadata: { before: oldTask, after: updatedTask, changes }
      })
    }
    
    return updatedTask
  }

  async function setUrgente(id: string): Promise<Task | null> {
    const taskIndex = tasks.value.findIndex(t => t.id === id)
    if (taskIndex === -1) return null

    const task = tasks.value[taskIndex]
    
    // Verificar se já existe uma tarefa urgente para o responsável
    const existingUrgent = tasks.value.find(t => 
      t.responsavel === task.responsavel && 
      t.urgente && 
      t.id !== id
    )
    
    if (existingUrgent) {
      throw new Error(`Já existe uma tarefa urgente para ${task.responsavel}`)
    }

    // Marcar como urgente
    const updatedTask = {
      ...task,
      urgente: true,
      status: 'URGENTE' as TaskStatus,
      updatedAt: new Date().toISOString()
    }

    tasks.value[taskIndex] = updatedTask

    // Bloquear outras tarefas do mesmo responsável
    const tasksToBlock = tasks.value.filter(t => 
      t.responsavel === task.responsavel && 
      t.id !== id && 
      t.status !== 'APROVADO'
    )

    tasksToBlock.forEach(async (blockedTask) => {
      const blockedIndex = tasks.value.findIndex(t => t.id === blockedTask.id)
      if (blockedIndex !== -1) {
        tasks.value[blockedIndex] = {
          ...blockedTask,
          status: 'BLOQUEADO' as TaskStatus,
          updatedAt: new Date().toISOString()
        }
        
        await addLog({
          taskId: blockedTask.id,
          action: 'blocked',
          description: `Tarefa bloqueada devido à urgência de "${task.nome}"`,
          metadata: { urgentTaskId: id }
        })
      }
    })

    await persistTasks()
    
    await addLog({
      taskId: id,
      action: 'urgent_set',
      description: `Tarefa marcada como urgente`,
      metadata: { task: updatedTask }
    })

    return updatedTask
  }

  async function resolveUrgente(id: string): Promise<Task | null> {
    const taskIndex = tasks.value.findIndex(t => t.id === id)
    if (taskIndex === -1) return null

    const task = tasks.value[taskIndex]
    
    if (!task.urgente) {
      throw new Error('Tarefa não está marcada como urgente')
    }

    // Desmarcar urgente
    const updatedTask = {
      ...task,
      urgente: false,
      status: 'A FAZER' as TaskStatus,
      updatedAt: new Date().toISOString()
    }

    tasks.value[taskIndex] = updatedTask

    // Desbloquear outras tarefas do mesmo responsável
    const tasksToUnblock = tasks.value.filter(t => 
      t.responsavel === task.responsavel && 
      t.status === 'BLOQUEADO'
    )

    tasksToUnblock.forEach(async (unblockedTask) => {
      const unblockedIndex = tasks.value.findIndex(t => t.id === unblockedTask.id)
      if (unblockedIndex !== -1) {
        tasks.value[unblockedIndex] = {
          ...unblockedTask,
          status: 'A FAZER' as TaskStatus,
          updatedAt: new Date().toISOString()
        }
        
        await addLog({
          taskId: unblockedTask.id,
          action: 'unblocked',
          description: `Tarefa desbloqueada após resolução da urgência`,
          metadata: { resolvedUrgentTaskId: id }
        })
      }
    })

    await persistTasks()
    
    await addLog({
      taskId: id,
      action: 'urgent_resolved',
      description: `Urgência resolvida`,
      metadata: { task: updatedTask }
    })

    return updatedTask
  }

  async function moveStatus(id: string, nextStatus: TaskStatus): Promise<Task | null> {
    const taskIndex = tasks.value.findIndex(t => t.id === id)
    if (taskIndex === -1) return null

    const task = tasks.value[taskIndex]
    
    // Verificar se pode sair de BLOQUEADO/URGENTE
    if ((task.status === 'BLOQUEADO' || task.status === 'URGENTE') && 
        nextStatus !== 'BLOQUEADO' && nextStatus !== 'URGENTE') {
      throw new Error('Tarefas bloqueadas ou urgentes só podem ser alteradas via ações de prioridade')
    }

    const oldStatus = task.status
    const updatedTask = {
      ...task,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    }

    tasks.value[taskIndex] = updatedTask
    await persistTasks()
    
    await addLog({
      taskId: id,
      action: 'status_changed',
      description: `Status alterado de "${oldStatus}" para "${nextStatus}"`,
      metadata: { oldStatus, newStatus: nextStatus }
    })

    return updatedTask
  }

  async function reallocateFor(responsavel: Role): Promise<void> {
    const userTasks = tasks.value
      .filter(task => task.responsavel === responsavel && !task.paralelo)
      .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())

    let currentDate = new Date()
    
    for (const task of userTasks) {
      const taskIndex = tasks.value.findIndex(t => t.id === task.id)
      if (taskIndex === -1) continue

      const newDataInicio = currentDate.toISOString().split('T')[0]
      const newDataFim = calculateDataFim(newDataInicio, task.prazoDias)
      
      tasks.value[taskIndex] = {
        ...task,
        dataInicio: newDataInicio,
        dataFim: newDataFim,
        updatedAt: new Date().toISOString()
      }

      currentDate = addBusinessDays(new Date(newDataFim), 1)
    }

    await persistTasks()
    
    await addLog({
      taskId: 'system',
      action: 'reallocated',
      description: `Agenda reorganizada para ${responsavel}`,
      metadata: { responsavel, taskCount: userTasks.length }
    })
  }

  async function deleteTask(id: string): Promise<boolean> {
    const taskIndex = tasks.value.findIndex(t => t.id === id)
    if (taskIndex === -1) return false

    const deletedTask = tasks.value[taskIndex]
    tasks.value.splice(taskIndex, 1)
    await persistTasks()
    
    await addLog({
      taskId: id,
      action: 'task_deleted',
      description: `Tarefa "${deletedTask.nome}" removida`,
      metadata: { task: deletedTask }
    })
    
    return true
  }

  // Funções auxiliares
  async function calculateNextAvailableSlot(responsavel: Role, preferredDate: string, prazoDias: number): Promise<string> {
    const userTasks = tasks.value
      .filter(task => task.responsavel === responsavel && !task.paralelo)
      .sort((a, b) => new Date(b.dataFim).getTime() - new Date(a.dataFim).getTime())

    if (userTasks.length === 0) {
      return preferredDate
    }

    const lastTaskEnd = new Date(userTasks[0].dataFim)
    const nextAvailable = getNextBusinessDay(lastTaskEnd)
    
    return nextAvailable.toISOString().split('T')[0]
  }

  function getEventColor(status: TaskStatus, urgente?: boolean): string {
    if (urgente) return '#ef4444' // red
    
    switch (status) {
      case 'A FAZER':
        return '#6b7280' // gray
      case 'FAZENDO':
        return '#3b82f6' // blue
      case 'AGUARDANDO APROVAÇÃO':
        return '#eab308' // yellow
      case 'QA':
        return '#8b5cf6' // purple
      case 'APROVADO':
        return '#10b981' // green
      case 'BLOQUEADO':
        return '#dc2626' // red
      case 'URGENTE':
        return '#f97316' // orange
      default:
        return '#6b7280' // gray
    }
  }

  async function addLog(logInput: LogCreateInput): Promise<void> {
    const logEntry: LogEntry = {
      id: generateId(),
      ...logInput,
      timestamp: new Date().toISOString()
    }
    
    logs.value.push(logEntry)
    await persistLogs()
  }

  async function persistTasks() {
    try {
      await persistToStorage(TASKS_STORAGE_KEY, tasks.value)
    } catch (err) {
      error.value = 'Erro ao salvar tarefas'
      logger.error('Erro ao persistir tarefas', err)
    }
  }

  async function persistLogs() {
    try {
      await persistToStorage(LOGS_STORAGE_KEY, logs.value)
    } catch (err) {
      logger.error('Erro ao persistir logs', err)
    }
  }

  return {
    // State
    tasks: readonly(tasks),
    logs: readonly(logs),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Getters
    byResponsavel,
    calendarEvents,
    kanbanColumns,
    
    // Actions
    loadTasks,
    createTask,
    updateTask,
    setUrgente,
    resolveUrgente,
    moveStatus,
    reallocateFor,
    deleteTask
  }
})
