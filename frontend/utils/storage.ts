export interface IStorage<Mapping extends Record<string, any>> {
  /**Retrieves the value associated with the given key.
   * @param key The key to retrieve the value for.
   * @returns The value associated with the key or `undefined` if the key does not exist.
   */
  get$<T extends keyof Mapping>(key: T): Mapping[T]
  /**Sets the value associated with the given key.
   * @param key The key to set the value for.
   * @param value The value to set for the key.
   */
  set$<T extends keyof Mapping>(key: T, value: Mapping[T]): void
  /**Deletes the value associated with the given key.
   * @param key The key to delete.
   */
  delete$<T extends keyof Mapping>(key: T): void
  update$<T extends keyof Mapping>(key: T, updateFn: (prevValue: Mapping[T]) => Mapping[T]): void
}

/**Create a type-safe version of `localStorage`, `sessionStorage`, ...
 * 
 * This function helps you interact with storage mechanisms like `localStorage` and `sessionStorage`
 * in a type-safe way. It also automatically converts your data to strings for storage and back to
 * their original types when retrieving data.
 * 
 * @example
 * ```
 * const storage = createStorage<{
 *   something: number
 * }>(localStorage)
 * 
 * storage.set$('something', 10)
 * // no type error
 * 
 * storage.set$('something else', 10)
 * //           ^^^^^^^^^^^^^^^^
 * // Argument of type '"something else"' is not assignable to parameter of type '"something"'
 * 
 * storage.set$('something', 'invalid')
 * //                        ^^^^^^^^^
 * // Argument of type 'string' is not assignable to parameter of type 'number'
 * ```
 * 
 * @param storage it can be `localStorage`, `sessionStorage`, or something else.
 * @returns objects contain a few methods to interect with the browser storage.
 * @see {@link IStorage}
 */
export function createStorage<Mapping extends Record<string, any>>(storage: Storage): IStorage<Mapping> {
  const getValueInStorage = (key: any) => {
    const data = storage.getItem(key as string)
    if (!data) return data

    if (data === 'undefined') return undefined
    try {
      return JSON.parse(data)
    } catch (error) {
      return data
    }
  }

  const setValue = (key: any, value: any) => {
    storage.setItem(key as string, JSON.stringify(value))
  }

  return {
    get$: getValueInStorage,
    set$: setValue,
    delete$(key) {
      storage.removeItem(key as string)
    },
    update$(key, updateFn) {
      const prevValue = getValueInStorage(key)
      const newValue = updateFn(prevValue)
      setValue(key, newValue)
    }
  }
}

export function updateStorage<
  Mapping extends Record<string, any>,
  Key extends keyof Mapping
>(storage: IStorage<Mapping>, key: Key, call: (prev: Mapping[Key] | null) => Mapping[Key]) {
  const previous = storage.get$(key)
  const newValue = call(previous)
  storage.set$(key, newValue)
}
