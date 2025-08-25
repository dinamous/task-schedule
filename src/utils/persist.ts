export async function persistToStorage<T>(key: string, data: T): Promise<void> {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao persistir dados:', error)
    throw error
  }
}

export async function loadFromStorage<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return defaultValue
    
    return JSON.parse(stored) as T
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    return defaultValue
  }
}

export async function removeFromStorage(key: string): Promise<void> {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Erro ao remover dados:', error)
    throw error
  }
}

export async function clearStorage(): Promise<void> {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Erro ao limpar storage:', error)
    throw error
  }
}
