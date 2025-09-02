import { computed } from 'vue'
import type { Task, Role } from '@/types/task'
import { addBusinessDays, isWeekend, getNextBusinessDay } from '@/utils/date'

export interface BusinessDayTask {
  date: string
  tasks: Task[]
  isWeekend: boolean
  isBusinessDay: boolean
}

export interface TaskAllocation {
  task: Task
  startDate: string
  endDate: string
  businessDays: string[]
  conflicts: Task[]
}

export function useBusinessDaysRendering(tasks: Task[]) {
  /**
   * Gera um array de dias úteis para um período específico
   */
  function generateBusinessDays(startDate: string, endDate: string): string[] {
    const businessDays: string[] = []
    const current = new Date(startDate)
    const end = new Date(endDate)
    
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0]
      if (!isWeekend(current)) {
        businessDays.push(dateStr)
      }
      current.setDate(current.getDate() + 1)
    }
    
    return businessDays
  }

  /**
   * Calcula a alocação de uma tarefa considerando dias úteis
   */
  function calculateTaskAllocation(task: Task): TaskAllocation {
    const businessDays = generateBusinessDays(task.dataInicio, task.dataFim)
    
    // Verificar conflitos com outras tarefas do mesmo responsável
    const conflicts = tasks.filter(otherTask => 
      otherTask.id !== task.id &&
      otherTask.responsavel === task.responsavel &&
      !otherTask.paralelo &&
      hasDateOverlap(task, otherTask)
    )
    
    return {
      task,
      startDate: task.dataInicio,
      endDate: task.dataFim,
      businessDays,
      conflicts
    }
  }

  /**
   * Verifica se duas tarefas têm sobreposição de datas
   */
  function hasDateOverlap(task1: Task, task2: Task): boolean {
    const start1 = new Date(task1.dataInicio)
    const end1 = new Date(task1.dataFim)
    const start2 = new Date(task2.dataInicio)
    const end2 = new Date(task2.dataFim)
    
    return start1 <= end2 && start2 <= end1
  }

  /**
   * Calcula o próximo slot disponível para um responsável
   */
  function calculateNextAvailableSlot(
    responsavel: Role, 
    preferredDate: string, 

  ): string {
    const userTasks = tasks
      .filter(task => 
        task.responsavel === responsavel && 
        !task.paralelo &&
        task.status !== 'APROVADO'
      )
      .sort((a, b) => new Date(b.dataFim).getTime() - new Date(a.dataFim).getTime())

    if (userTasks.length === 0) {
      return preferredDate
    }

    // Encontrar a última data de fim das tarefas do usuário
    const lastTaskEnd = new Date(userTasks[0].dataFim)
    const nextAvailable = getNextBusinessDay(lastTaskEnd)
    
    return nextAvailable.toISOString().split('T')[0]
  }

  /**
   * Aloca tarefas sequencialmente para um responsável
   */
  function allocateTasksSequentially(responsavel: Role): Task[] {
    const userTasks = tasks
      .filter(task => 
        task.responsavel === responsavel && 
        !task.paralelo &&
        task.status !== 'APROVADO'
      )
      .sort((a, b) => {
        // Ordenar por prioridade (menor = mais prioritária) e data de criação
        if (a.prioridade !== b.prioridade) {
          return (a.prioridade || 999) - (b.prioridade || 999)
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })

    let currentDate = new Date()
    
    return userTasks.map(task => {
      const newDataInicio = currentDate.toISOString().split('T')[0]
      const newDataFim = addBusinessDays(currentDate, task.prazoDias).toISOString().split('T')[0]
      
      // Atualizar data para próxima tarefa
      currentDate = addBusinessDays(new Date(newDataFim), 1)
      
      return {
        ...task,
        dataInicio: newDataInicio,
        dataFim: newDataFim
      }
    })
  }

  /**
   * Gera uma visualização de calendário por dias úteis
   */
  const businessDaysCalendar = computed(() => {
    if (tasks.length === 0) return []

    // Encontrar o período total das tarefas
    const allDates = tasks.flatMap(task => [
      task.dataInicio,
      task.dataFim
    ]).filter(Boolean)
    
    const minDate = new Date(Math.min(...allDates.map(d => new Date(d).getTime())))
    const maxDate = new Date(Math.max(...allDates.map(d => new Date(d).getTime())))
    
    // Gerar array de dias úteis
    const calendar: BusinessDayTask[] = []
    const current = new Date(minDate)
    
    while (current <= maxDate) {
      const dateStr = current.toISOString().split('T')[0]
      const isWeekendDay = isWeekend(current)
      
      // Filtrar tarefas para este dia
      const dayTasks = tasks.filter(task => {
        const start = new Date(task.dataInicio)
        const end = new Date(task.dataFim)
        const currentDate = new Date(dateStr)
        return currentDate >= start && currentDate <= end
      })
      
      calendar.push({
        date: dateStr,
        tasks: dayTasks,
        isWeekend: isWeekendDay,
        isBusinessDay: !isWeekendDay
      })
      
      // Criar nova instância da data para não mutar a original
      current.setDate(current.getDate() + 1)
    }
    
    return calendar
  })

  /**
   * Agrupa tarefas por responsável para visualização
   */
  const tasksByResponsavel = computed(() => {
    const grouped: Record<Role, Task[]> = {}
    
    tasks.forEach(task => {
      if (!grouped[task.responsavel]) {
        grouped[task.responsavel] = []
      }
      grouped[task.responsavel].push(task)
    })
    
    // Ordenar tarefas de cada responsável
    Object.keys(grouped).forEach(responsavel => {
      grouped[responsavel as Role].sort((a, b) => {
        if (a.prioridade !== b.prioridade) {
          return (a.prioridade || 999) - (b.prioridade || 999)
        }
        return new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
      })
    })
    
    return grouped
  })

  /**
   * Calcula estatísticas de alocação
   */
  const allocationStats = computed(() => {
    const stats = {
      totalTasks: tasks.length,
      totalBusinessDays: 0,
      averageTasksPerDay: 0,
      maxTasksPerDay: 0,
      conflicts: 0,
      byResponsavel: {} as Record<Role, {
        total: number
        businessDays: number
        averagePerDay: number
        conflicts: number
      }>
    }
    
    // Calcular estatísticas por responsável
    Object.entries(tasksByResponsavel.value).forEach(([responsavel, userTasks]) => {
      const userBusinessDays = new Set<string>()
      let userConflicts = 0
      
      userTasks.forEach(task => {
        const businessDays = generateBusinessDays(task.dataInicio, task.dataFim)
        businessDays.forEach(day => userBusinessDays.add(day))
        
        // Verificar conflitos
        const conflicts = userTasks.filter(otherTask => 
          otherTask.id !== task.id &&
          !otherTask.paralelo &&
          hasDateOverlap(task, otherTask)
        )
        userConflicts += conflicts.length
      })
      
      stats.byResponsavel[responsavel as Role] = {
        total: userTasks.length,
        businessDays: userBusinessDays.size,
        averagePerDay: userTasks.length / Math.max(userBusinessDays.size, 1),
        conflicts: userConflicts / 2 // Dividir por 2 pois cada conflito é contado duas vezes
      }
    })
    
    // Calcular estatísticas gerais
    const allBusinessDays = new Set<string>()
    let maxTasksInDay = 0
    
    businessDaysCalendar.value.forEach(day => {
      if (day.isBusinessDay) {
        allBusinessDays.add(day.date)
        maxTasksInDay = Math.max(maxTasksInDay, day.tasks.length)
      }
    })
    
    stats.totalBusinessDays = allBusinessDays.size
    stats.averageTasksPerDay = tasks.length / Math.max(stats.totalBusinessDays, 1)
    stats.maxTasksPerDay = maxTasksInDay
    
    // Calcular total de conflitos
    stats.conflicts = Object.values(stats.byResponsavel)
      .reduce((sum, user) => sum + user.conflicts, 0)
    
    return stats
  })

  return {
    // Funções principais
    generateBusinessDays,
    calculateTaskAllocation,
    calculateNextAvailableSlot,
    allocateTasksSequentially,
    
    // Computed properties
    businessDaysCalendar,
    tasksByResponsavel,
    allocationStats,
    
    // Funções auxiliares
    hasDateOverlap
  }
}
