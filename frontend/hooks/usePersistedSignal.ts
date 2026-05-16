import { createSignal, type Setter, type Signal } from "solid-js"

/**Make a value persistant across page reload or when going to other route.
 * @param storage any kind of storage, e.g [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) or [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
 * @param keyName the key name 
 * @param initialState you can guess what this does
 * @returns a getter and setter function, just like solidjs's [`createSignal()`](https://docs.solidjs.com/reference/basic-reactivity/create-signal#createsignal)
 */
export function usePersistedSignal<T>(storage: Storage, keyName: string, initialState?: T): Signal<T> {
  const existingValue = getValueInStorage(storage, keyName)
  const [value, setValue] = createSignal<T>(existingValue ?? initialState)
  if (existingValue == null && initialState !== undefined) {
    setValueInStorage(storage, keyName, initialState)
  }

  // @ts-ignore - ignore type error
  const wrappedSetValue: Setter<T> = (value) => {
    const newValue = setValue(value!)
    setValueInStorage(storage, keyName, newValue)
    return newValue
  }

  return [value, wrappedSetValue] as Signal<T>
}

function getValueInStorage(storage: Storage, key: any) {
  const data = storage.getItem(key)
  if (!data) return data

  if (data === 'undefined') return undefined
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

function setValueInStorage(storage: Storage, key: string, value: any) {
  storage.setItem(key, JSON.stringify(value))
}