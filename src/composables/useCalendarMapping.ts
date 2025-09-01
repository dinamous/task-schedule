import { computed } from 'vue'
import type { Task } from '@/types/task'

export function useCalendarMapping(tasks: Task[]) {
  const calendarEvents = computed(() => {
    return tasks.map(task => ({
      id: task.id,
      title: task.nome, // antes era task.title
      start: task.dataFim ? new Date(task.dataFim).toISOString().split('T')[0] : null,
      end: task.dataFim ? new Date(task.dataFim).toISOString().split('T')[0] : null,
      allDay: true,
      backgroundColor: getEventColor(task.prioridade, task.status),
      borderColor: getEventColor(task.prioridade, task.status),
      textColor: '#ffffff',
      extendedProps: {
        task,
        priority: task.prioridade,
        status: task.status,
        description: task.link || '', // antes era task.description
        assignee: task.responsavel   // antes era task.assignee
      }
    })).filter(event => event.start !== null)
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

  function getEventColor(priority?: number, status?: string): string {
    if (status === 'APROVADO') return '#10b981' // verde
    
    if (priority !== undefined) {
      if (priority <= 2) return '#ef4444' // vermelho
      if (priority <= 4) return '#f97316' // laranja
      return '#eab308' // amarelo
    }

    return '#6b7280' // cinza padrão
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
