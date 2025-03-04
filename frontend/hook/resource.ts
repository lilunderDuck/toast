import { createSignal } from "solid-js"

export function useResource<T extends (...args: any[]) => Promise<any>>(anyFetchFn: T) {
  const [isLoading, setIsLoading] = createSignal(false)
  const [value, setValue] = createSignal<Awaited<ReturnType<T>>>()

  return {
    isLoading$: isLoading,
    data$: value,
    async fetch$(...stuff: Parameters<T>) {
      setIsLoading(true)
      const anyReturnValue = await anyFetchFn(...stuff)
      setIsLoading(false)
      setValue(anyReturnValue)
    }
  }
}