import { computed } from 'vue'
import type { Task } from '@/types/task'

export function useCalendarMapping(tasks: Task[]) {
  const calendarEvents = computed(() => {
    return tasks.map(task => ({
      id: task.id,
      title: task.nome,
      start: task.dataInicio,
      end: task.dataFim,
      allDay: true,
      backgroundColor: getEventColor(task.prioridade, task.status, task.urgente),
      borderColor: getEventColor(task.prioridade, task.status, task.urgente),
      textColor: '#ffffff',
      extendedProps: {
        task,
        priority: task.prioridade,
        status: task.status,
        description: task.link || '',
        assignee: task.responsavel,
        urgente: task.urgente,
        paralelo: task.paralelo
      }
    }))
  })

  const eventsByDate = computed(() => {
    const grouped: Record<string, any[]> = {}
    calendarEvents.value.forEach(event => {
      if (event.start) {
        if (!grouped[event.start]) grouped[event.start] = []
        grouped[event.start].push(event)
      }
    })
    return grouped
  })

  function getEventColor(priority?: number, status?: string, urgente?: boolean): string {
    // Prioridade para tarefas urgentes
    if (urgente) return '#ef4444' // vermelho
    
    if (status === 'APROVADO') return '#10b981' // verde
    if (status === 'URGENTE') return '#f97316' // laranja
    if (status === 'BLOQUEADO') return '#6b7280' // cinza
    
    if (priority !== undefined) {
      if (priority <= 2) return '#dc2626' // vermelho escuro
      if (priority <= 4) return '#f97316' // laranja
      return '#eab308' // amarelo
    }

    return '#3b82f6' // azul padrão
  }

  function getEventsForDate(date: string) {
    return eventsByDate.value[date] || []
  }

  function getEventsForDateRange(startDate: string, endDate: string) {
    const events: any[] = []
    Object.entries(eventsByDate.value).forEach(([date, dateEvents]) => {
      if (date >= startDate && date <= endDate) {
        events.push(...dateEvents)
      }
    })
    return events
  }

  return {
    calendarEvents,
    eventsByDate,
    getEventColor,
    getEventsForDate,
    getEventsForDateRange
  }
}
