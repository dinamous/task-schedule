import { computed } from 'vue'
import type { Task, TaskStatus, Role } from '@/types/task'
import { isOverdue, isDueSoon, getDaysUntil } from '@/utils/date'

export function useTasksAllocation(tasks: Task[]) {
  /** Estatísticas gerais */
  const allocationStats = computed(() => {
    const stats: {
      total: number
      byStatus: Record<TaskStatus, number>
      overdue: number
      dueSoon: number
      completed: number
      inProgress: number
    } = {
      total: tasks.length,
      byStatus: {
        'A FAZER': 0,
        'FAZENDO': 0,
        'AGUARDANDO APROVAÇÃO': 0,
        'QA': 0,
        'APROVADO': 0,
        'BLOQUEADO': 0,
        'URGENTE': 0
      },
      overdue: 0,
      dueSoon: 0,
      completed: 0,
      inProgress: 0
    }

    tasks.forEach(task => {
      stats.byStatus[task.status]++

      if (task.status === 'APROVADO') stats.completed++
      else if (task.status === 'FAZENDO' || task.status === 'AGUARDANDO APROVAÇÃO' || task.status === 'QA')
        stats.inProgress++

      if (task.dataFim) {
        const due = new Date(task.dataFim)
        if (isOverdue(due)) stats.overdue++
        else if (isDueSoon(due)) stats.dueSoon++
      }
    })

    return stats
  })

  /** Distribuição por responsável */
  const workloadDistribution = computed(() => {
    const assignees = new Map<Role, { tasks: Task[] }>()

    tasks.forEach(task => {
      const assignee = task.responsavel
      if (!assignees.has(assignee)) {
        assignees.set(assignee, { tasks: [] })
      }
      assignees.get(assignee)!.tasks.push(task)
    })

    return Array.from(assignees.entries()).map(([name, data]) => ({
      name,
      taskCount: data.tasks.length,
      tasks: data.tasks
    }))
  })

  /** Distribuição por prioridade (menor número = mais prioritária) */
  const priorityDistribution = computed(() => {
    const distribution: { high: Task[]; medium: Task[]; low: Task[] } = {
      high: [],
      medium: [],
      low: []
    }

    tasks.forEach(task => {
      if (task.prioridade !== undefined) {
        if (task.prioridade <= 2) distribution.high.push(task)
        else if (task.prioridade <= 4) distribution.medium.push(task)
        else distribution.low.push(task)
      }
    })

    return distribution
  })

  /** Distribuição temporal */
  const timeBasedAllocation = computed(() => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    return {
      overdue: tasks.filter(task => task.dataFim && isOverdue(new Date(task.dataFim))),
      dueToday: tasks.filter(task => task.dataFim && getDaysUntil(new Date(task.dataFim)) === 0),
      dueThisWeek: tasks.filter(
        task => task.dataFim && new Date(task.dataFim) >= today && new Date(task.dataFim) <= nextWeek
      ),
      dueThisMonth: tasks.filter(
        task => task.dataFim && new Date(task.dataFim) >= today && new Date(task.dataFim) <= nextMonth
      ),
      noDueDate: tasks.filter(task => !task.dataFim)
    }
  })

  /** Ordenação de tarefas por prioridade e datas */
  function getOptimalTaskOrder(): Task[] {
    return [...tasks].sort((a, b) => {
      const aPriority = a.prioridade ?? 99
      const bPriority = b.prioridade ?? 99
      if (aPriority !== bPriority) return aPriority - bPriority

      const aDue = a.dataFim ? new Date(a.dataFim) : null
      const bDue = b.dataFim ? new Date(b.dataFim) : null
      if (aDue && bDue) return aDue.getTime() - bDue.getTime()
      if (aDue && !bDue) return -1
      if (!aDue && bDue) return 1

      const aCreated = new Date(a.createdAt)
      const bCreated = new Date(b.createdAt)
      return aCreated.getTime() - bCreated.getTime()
    })
  }

  /** Tarefas de um responsável específico */
  function getTasksForAssignee(assignee: Role): Task[] {
    return tasks.filter(task => task.responsavel === assignee)
  }

  /** Tarefas por tag (se existir) */
  function getTasksByTag(tag: string): Task[] {
    return tasks.filter(task => task.link?.includes(tag)) // caso queira usar `tags` adicione na interface Task
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
