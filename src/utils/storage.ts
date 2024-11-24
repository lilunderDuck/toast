export interface IStorage<Mapping extends Record<string, any>> {
  $get<T extends keyof Mapping>(key: T): Mapping[T]
  $set<T extends keyof Mapping>(key: T, value: Mapping[T]): void
  $delete<T extends keyof Mapping>(key: T): void
}

export function createStorage<Mapping extends Record<string, any>>(storage: Storage): IStorage<Mapping> {
  return {
    $get(key) {
      const data = storage.getItem(key as string)
      if (!data) return data

      if (data === 'undefined') return undefined
      try {
        return JSON.parse(data)
      } catch (error) {
        return data
      }
    },
    $set(key, value) {
      storage.setItem(key as string, JSON. stringify(value))
    },
    $delete(key) {
      storage.removeItem(key as string)
    }
  }
}