export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  tags: string[]
  assignee?: string
  estimatedHours?: number
  actualHours?: number
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TaskCreateInput {
  title: string
  description?: string
  priority?: TaskPriority
  dueDate?: Date
  tags?: string[]
  assignee?: string
  estimatedHours?: number
}

export interface TaskUpdateInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: Date
  tags?: string[]
  assignee?: string
  estimatedHours?: number
  actualHours?: number
}

export interface TaskFilter {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assignee?: string
  tags?: string[]
  dueDateFrom?: Date
  dueDateTo?: Date
}
