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

export function getFilenameFromUrl(url: string) {
  return url.split("/").pop()!
}

export function trimFileExtension(fileName: string) {
  return fileName.split('.').slice(0, -1).join('.')
}

/**Convert a [golang's UNIX timestamp](https://pkg.go.dev/time#Time.Unix)
 * to a [javavscript's `Date` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
 * @param unixTimeInSeconds the unix timestamp from golang.
 */
export function goTimeToDate(unixTimeInSeconds: number) {
  return new Date(unixTimeInSeconds * 1000)
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('default', {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).format(date)
}

export function formatSecondsToMMSS(seconds: number) {
  return new Date(seconds * 1000).toISOString().substr(11, 8)
}