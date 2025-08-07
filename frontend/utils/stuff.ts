/**Pauses execution for a specified number of milliseconds.
 * @param delayInMs The number of milliseconds to delay.
 * @returns A Promise that resolves after the delay.
 */
export function sleep(delayInMs: number) {
  return new Promise(resolve => setTimeout(resolve, delayInMs))
}

/**Debounces a function, limiting the rate at which it can be called.
 * @param callback The function to debounce.
 * @param wait The number of milliseconds to wait before calling the function.
 * @returns The debounced function.
 */
export function debounce<Fn extends AnyFunction>(callback: Fn, wait: number) {
  let timeoutId: number | undefined = undefined
  return (...args: Parameters<Fn>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), wait) as unknown as number
  }
}

export function isObject(someValue: any): someValue is object {
  return toString.call(someValue) === '[object Object]'
}

export function getFilenameFromUrl(url: string) {
  return url.split("/").pop()!
}

export function trimFileExtension(fileName: string) {
  return fileName.split('.').slice(0, -1).join('.')
}