export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('pt-BR')
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('pt-BR')
}

export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - dateObj.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays === 2) return 'Amanhã'
  
  return `${diffDays} dias`
}

export function isOverdue(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  return dateObj < now
}

export function isDueSoon(date: Date | string, days: number = 3): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const soonDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  
  return dateObj >= now && dateObj <= soonDate
}

export function getDaysUntil(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = dateObj.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Funções para cálculo de dias úteis
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // 0 = domingo, 6 = sábado
}

export function addBusinessDays(startDate: Date, businessDays: number): Date {
  const result = new Date(startDate)
  let addedDays = 0
  
  while (addedDays < businessDays) {
    result.setDate(result.getDate() + 1)
    if (!isWeekend(result)) {
      addedDays++
    }
  }
  
  return result
}

export function calculateDataFim(dataInicio: string, prazoDias: number): string {
  const startDate = new Date(dataInicio)
  const endDate = addBusinessDays(startDate, prazoDias)
  return endDate.toISOString().split('T')[0]
}

export function getBusinessDaysBetween(startDate: Date, endDate: Date): number {
  let businessDays = 0
  const current = new Date(startDate)
  
  while (current <= endDate) {
    if (!isWeekend(current)) {
      businessDays++
    }
    current.setDate(current.getDate() + 1)
  }
  
  return businessDays
}

export function getNextBusinessDay(date: Date): Date {
  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + 1)
  
  while (isWeekend(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1)
  }
  
  return nextDay
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'A FAZER':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    case 'FAZENDO':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'AGUARDANDO APROVAÇÃO':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'QA':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'APROVADO':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'BLOQUEADO':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'URGENTE':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export function getRoleColor(role: string): string {
  switch (role) {
    case 'DEV':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'QA':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'UX':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    case 'DESIGNER':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    case 'PM':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'PO':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}
