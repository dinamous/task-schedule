import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { Task, TaskCreateInput, TaskUpdateInput } from '@/types/task'
import { generateId } from '@/utils/ids'
import { persistToStorage, loadFromStorage } from '@/utils/persist'
import { logger } from '@/utils/logger'

const STORAGE_KEY = 'tasks'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const tasksByStatus = computed(() => {
    const grouped = {
      todo: [] as Task[],
      'in-progress': [] as Task[],
      review: [] as Task[],
      done: [] as Task[]
    }
    
    tasks.value.forEach(task => {
      grouped[task.status].push(task)
    })
    
    return grouped
  })

  // Actions
  async function loadTasks() {
    isLoading.value = true
    error.value = null
    
    try {
      const storedTasks = await loadFromStorage<Task[]>(STORAGE_KEY, [])
      tasks.value = storedTasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }))
    } catch (err) {
      error.value = 'Erro ao carregar tarefas'
      logger.error('Erro ao carregar tarefas', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(input: TaskCreateInput): Promise<Task> {
    const task: Task = {
      id: generateId(),
      title: input.title,
      description: input.description,
      status: 'todo',
      priority: input.priority || 'medium',
      dueDate: input.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: input.tags || [],
      assignee: input.assignee,
      estimatedHours: input.estimatedHours
    }

    tasks.value.push(task)
    await persistTasks()
    
    logger.info('Tarefa criada', { taskId: task.id, title: task.title })
    return task
  }

  async function updateTask(id: string, input: TaskUpdateInput): Promise<Task | null> {
    const taskIndex = tasks.value.findIndex(t => t.id === id)
    if (taskIndex === -1) return null

    const updatedTask = {
      ...tasks.value[taskIndex],
      ...input,
      updatedAt: new Date()
    }

    tasks.value[taskIndex] = updatedTask
    await persistTasks()
    
    logger.info('Tarefa atualizada', { taskId: id, changes: input })
    return updatedTask
  }

  async function deleteTask(id: string): Promise<boolean> {
    const taskIndex = tasks.value.findIndex(t => t.id === id)
    if (taskIndex === -1) return false

    const deletedTask = tasks.value[taskIndex]
    tasks.value.splice(taskIndex, 1)
    await persistTasks()
    
    logger.info('Tarefa deletada', { taskId: id, title: deletedTask.title })
    return true
  }

  async function persistTasks() {
    try {
      await persistToStorage(STORAGE_KEY, tasks.value)
    } catch (err) {
      error.value = 'Erro ao salvar tarefas'
      logger.error('Erro ao persistir tarefas', err)
    }
  }

  return {
    // State
    tasks: readonly(tasks),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Computed
    tasksByStatus,
    
    // Actions
    loadTasks,
    createTask,
    updateTask,
    deleteTask
  }
})
