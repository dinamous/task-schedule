import { computed } from 'vue'
import type { Task } from '@/types/task'
import { isOverdue, isDueSoon, getDaysUntil } from '@/utils/date'

export function useTasksAllocation(tasks: Task[]) {
  const allocationStats = computed(() => {
    const stats = {
      total: tasks.length,
      byStatus: {
        todo: 0,
        'in-progress': 0,
        review: 0,
        done: 0
      },
      byPriority: {
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      overdue: 0,
      dueSoon: 0,
      completed: 0,
      inProgress: 0
    }

    tasks.forEach(task => {
      stats.byStatus[task.status]++
      stats.byPriority[task.priority]++
      
      if (task.status === 'done') {
        stats.completed++
      } else if (task.status === 'in-progress' || task.status === 'review') {
        stats.inProgress++
      }
      
      if (task.dueDate) {
        if (isOverdue(task.dueDate)) {
          stats.overdue++
        } else if (isDueSoon(task.dueDate)) {
          stats.dueSoon++
        }
      }
    })

    return stats
  })

  const workloadDistribution = computed(() => {
    const assignees = new Map<string, { tasks: Task[], totalHours: number }>()
    
    tasks.forEach(task => {
      if (task.assignee) {
        if (!assignees.has(task.assignee)) {
          assignees.set(task.assignee, { tasks: [], totalHours: 0 })
        }
        
        const assignee = assignees.get(task.assignee)!
        assignee.tasks.push(task)
        assignee.totalHours += task.estimatedHours || 0
      }
    })
    
    return Array.from(assignees.entries()).map(([name, data]) => ({
      name,
      taskCount: data.tasks.length,
      totalHours: data.totalHours,
      tasks: data.tasks
    }))
  })

  const priorityDistribution = computed(() => {
    const distribution = {
      urgent: [] as Task[],
      high: [] as Task[],
      medium: [] as Task[],
      low: [] as Task[]
    }
    
    tasks.forEach(task => {
      distribution[task.priority].push(task)
    })
    
    return distribution
  })

  const timeBasedAllocation = computed(() => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    return {
      overdue: tasks.filter(task => task.dueDate && isOverdue(task.dueDate)),
      dueToday: tasks.filter(task => task.dueDate && getDaysUntil(task.dueDate) === 0),
      dueThisWeek: tasks.filter(task => 
        task.dueDate && 
        task.dueDate >= today && 
        task.dueDate <= nextWeek
      ),
      dueThisMonth: tasks.filter(task => 
        task.dueDate && 
        task.dueDate >= today && 
        task.dueDate <= nextMonth
      ),
      noDueDate: tasks.filter(task => !task.dueDate)
    }
  })

  function getOptimalTaskOrder(): Task[] {
    return [...tasks].sort((a, b) => {
      // Prioridade por urgência
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      // Se mesma prioridade, ordenar por data de vencimento
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime()
      }
      
      // Tarefas com data vêm antes das sem data
      if (a.dueDate && !b.dueDate) return -1
      if (!a.dueDate && b.dueDate) return 1
      
      // Por fim, ordenar por data de criação (mais antigas primeiro)
      return a.createdAt.getTime() - b.createdAt.getTime()
    })
  }

  function getTasksForAssignee(assignee: string): Task[] {
    return tasks.filter(task => task.assignee === assignee)
  }

  function getTasksByTag(tag: string): Task[] {
    return tasks.filter(task => task.tags.includes(tag))
  }

  return {
    allocationStats,
    workloadDistribution,
    priorityDistribution,
    timeBasedAllocation,
    getOptimalTaskOrder,
    getTasksForAssignee,
    getTasksByTag
  }
}
