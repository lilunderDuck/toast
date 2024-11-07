export const sleep = (delayInMs: number) => new Promise(resolve => setTimeout(resolve, delayInMs))

export const debounce = <Fn extends AnyFunction>(callback: Fn, wait: number) => {
  let timeoutId: number | undefined = undefined
  return (...args: Parameters<Fn>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), wait) as unknown as number
  }
}