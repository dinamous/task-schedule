export type TaskStatus = 
  | 'A FAZER' 
  | 'FAZENDO' 
  | 'AGUARDANDO APROVAÇÃO' 
  | 'QA' 
  | 'APROVADO' 
  | 'BLOQUEADO' 
  | 'URGENTE'

export type Role = 'DEV' | 'QA' | 'UX' | 'DESIGNER' | 'PM' | 'PO' | string

export interface Task {
  id: string
  nome: string
  link?: string
  dataInicio: string      // ISO
  prazoDias: number       // em dias úteis
  dataFim: string         // ISO (calculado)
  responsavel: Role
  gerente: string
  status: TaskStatus
  prioridade?: number     // menor = mais prioritária
  urgente?: boolean
  paralelo?: boolean      // permite coexistir com outras
  createdAt: string
  updatedAt: string
}

export interface TaskCreateInput {
  nome: string
  link?: string
  dataInicio: string
  prazoDias: number
  responsavel: Role
  gerente: string
  status?: TaskStatus
  prioridade?: number
  urgente?: boolean
  paralelo?: boolean
}

export interface TaskUpdateInput {
  nome?: string
  link?: string
  dataInicio?: string
  prazoDias?: number
  responsavel?: Role
  gerente?: string
  status?: TaskStatus
  prioridade?: number
  urgente?: boolean
  paralelo?: boolean
}

export interface TaskFilter {
  status?: TaskStatus[]
  responsavel?: Role
  gerente?: string
  urgente?: boolean
  dataInicioFrom?: string
  dataInicioTo?: string
}
