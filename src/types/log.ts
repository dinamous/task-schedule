export interface LogEntry {
  id: string
  taskId: string
  action: LogAction
  description: string
  timestamp: string
  userId?: string
  metadata?: Record<string, any>
}

export type LogAction = 
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'status_changed'
  | 'priority_changed'
  | 'urgent_set'
  | 'urgent_resolved'
  | 'reallocated'
  | 'blocked'
  | 'unblocked'

export interface LogCreateInput {
  taskId: string
  action: LogAction
  description: string
  userId?: string
  metadata?: Record<string, any>
}
