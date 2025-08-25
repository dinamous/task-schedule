import { computed } from 'vue'
import type { Task } from '@/types/task'

export function useCalendarMapping(tasks: Task[]) {
  const calendarEvents = computed(() => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      start: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
      end: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
      allDay: true,
      backgroundColor: getEventColor(task.priority, task.status),
      borderColor: getEventColor(task.priority, task.status),
      textColor: '#ffffff',
      extendedProps: {
        task,
        priority: task.priority,
        status: task.status,
        description: task.description,
        assignee: task.assignee
      }
    })).filter(event => event.start !== null)
  })

  const eventsByDate = computed(() => {
    const grouped: Record<string, any[]> = {}
    
    calendarEvents.value.forEach(event => {
      if (event.start) {
        if (!grouped[event.start]) {
          grouped[event.start] = []
        }
        grouped[event.start].push(event)
      }
    })
    
    return grouped
  })

  function getEventColor(priority: string, status: string): string {
    if (status === 'done') return '#10b981' // green
    
    switch (priority) {
      case 'urgent':
        return '#ef4444' // red
      case 'high':
        return '#f97316' // orange
      case 'medium':
        return '#eab308' // yellow
      case 'low':
        return '#22c55e' // green
      default:
        return '#6b7280' // gray
    }
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
