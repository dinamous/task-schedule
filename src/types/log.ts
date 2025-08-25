export interface Log {
  id: string
  taskId: string
  action: LogAction
  description: string
  timestamp: Date
  userId?: string
  metadata?: Record<string, any>
}

export type LogAction = 
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'status_changed'
  | 'priority_changed'
  | 'assigned'
  | 'time_logged'
  | 'comment_added'

export interface LogCreateInput {
  taskId: string
  action: LogAction
  description: string
  userId?: string
  metadata?: Record<string, any>
}
