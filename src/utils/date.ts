export function formatDate(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      console.error('formatDate: data inválida:', date)
      return 'Data inválida'
    }
    
    return dateObj.toLocaleDateString('pt-BR')
  } catch (error) {
    console.error('formatDate: erro ao formatar:', error)
    return 'Erro na data'
  }
}

export function formatDateTime(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      console.error('formatDateTime: data inválida:', date)
      return 'Data inválida'
    }
    
    return dateObj.toLocaleString('pt-BR')
  } catch (error) {
    console.error('formatDateTime: erro ao formatar:', error)
    return 'Erro na data'
  }
}

export function formatRelativeDate(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      console.error('formatRelativeDate: data inválida:', date)
      return 'Data inválida'
    }
    
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - dateObj.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays === 2) return 'Amanhã'
    
    return `${diffDays} dias`
  } catch (error) {
    console.error('formatRelativeDate: erro ao formatar:', error)
    return 'Erro na data'
  }
}

export function isOverdue(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      console.error('isOverdue: data inválida:', date)
      return false
    }
    
    const now = new Date()
    return dateObj < now
  } catch (error) {
    console.error('isOverdue: erro ao verificar:', error)
    return false
  }
}

export function isDueSoon(date: Date | string, days: number = 3): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      console.error('isDueSoon: data inválida:', date)
      return false
    }
    
    const now = new Date()
    const soonDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    
    return dateObj >= now && dateObj <= soonDate
  } catch (error) {
    console.error('isDueSoon: erro ao verificar:', error)
    return false
  }
}

export function getDaysUntil(date: Date | string): number {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      console.error('getDaysUntil: data inválida:', date)
      return 0
    }
    
    const now = new Date()
    const diffTime = dateObj.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  } catch (error) {
    console.error('getDaysUntil: erro ao calcular:', error)
    return 0
  }
}

// Funções para cálculo de dias úteis
export function isWeekend(date: Date): boolean {
  try {
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      console.error('isWeekend: data inválida:', date)
      return false
    }
    
    const day = date.getDay()
    return day === 0 || day === 6 // 0 = domingo, 6 = sábado
  } catch (error) {
    console.error('isWeekend: erro ao verificar:', error)
    return false
  }
}

export function addBusinessDays(startDate: Date, businessDays: number): Date {
  console.log('addBusinessDays:', { startDate, businessDays })
  
  try {
    // Verificar se a data é válida
    if (isNaN(startDate.getTime())) {
      console.error('addBusinessDays: data de início inválida:', startDate)
      return startDate
    }
    
    const result = new Date(startDate)
    let addedDays = 0
    
    // Se businessDays for 0, retorna a data inicial
    if (businessDays === 0) {
      return result
    }
    
    while (addedDays < businessDays) {
      result.setDate(result.getDate() + 1)
      if (!isWeekend(result)) {
        addedDays++
      }
    }
    
    console.log('addBusinessDays result:', result)
    return result
  } catch (error) {
    console.error('addBusinessDays: erro ao calcular:', error)
    return startDate
  }
}

export function calculateDataFim(dataInicio: string, prazoDias: number): string {
  console.log('calculateDataFim input:', { dataInicio, prazoDias })
  
  if (!dataInicio || !prazoDias || prazoDias <= 0) {
    console.log('calculateDataFim: dados inválidos')
    return dataInicio
  }
  
  try {
    const startDate = new Date(dataInicio)
    
    // Verificar se a data é válida
    if (isNaN(startDate.getTime())) {
      console.error('calculateDataFim: data de início inválida:', dataInicio)
      return dataInicio
    }
    
    const endDate = addBusinessDays(startDate, prazoDias)
    const result = endDate.toISOString().split('T')[0]
    
    console.log('calculateDataFim result:', result)
    return result
  } catch (error) {
    console.error('calculateDataFim: erro ao calcular:', error)
    return dataInicio
  }
}

export function getBusinessDaysBetween(startDate: Date, endDate: Date): number {
  try {
    // Verificar se as datas são válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('getBusinessDaysBetween: datas inválidas:', { startDate, endDate })
      return 0
    }
    
    let businessDays = 0
    const current = new Date(startDate)
    
    while (current <= endDate) {
      if (!isWeekend(current)) {
        businessDays++
      }
      current.setDate(current.getDate() + 1)
    }
    
    return businessDays
  } catch (error) {
    console.error('getBusinessDaysBetween: erro ao calcular:', error)
    return 0
  }
}

export function getNextBusinessDay(date: Date): Date {
  try {
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      console.error('getNextBusinessDay: data inválida:', date)
      return date
    }
    
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    
    while (isWeekend(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1)
    }
    
    return nextDay
  } catch (error) {
    console.error('getNextBusinessDay: erro ao calcular:', error)
    return date
  }
}

export function getStatusColor(status: string): string {
  try {
    if (!status || typeof status !== 'string') {
      console.error('getStatusColor: status inválido:', status)
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
    
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
  } catch (error) {
    console.error('getStatusColor: erro ao obter cor:', error)
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export function getRoleColor(role: string): string {
  try {
    if (!role || typeof role !== 'string') {
      console.error('getRoleColor: role inválido:', role)
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
    
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
  } catch (error) {
    console.error('getRoleColor: erro ao obter cor:', error)
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}
