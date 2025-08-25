import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Computed
  const tasksByStatus = computed(() => {
    const grouped = {
      todo: [],
      'in-progress': [],
      review: [],
      done: []
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
      // TODO: Implement localStorage loading
      tasks.value = []
    } catch (err) {
      error.value = 'Erro ao carregar tarefas'
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(taskData) {
    // TODO: Implement task creation
    console.log('Creating task:', taskData)
  }

  async function updateTask(id, updates) {
    // TODO: Implement task update
    console.log('Updating task:', id, updates)
  }

  async function deleteTask(id) {
    // TODO: Implement task deletion
    console.log('Deleting task:', id)
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
