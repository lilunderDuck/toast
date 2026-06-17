import { onCleanup } from "solid-js"

export function useBodyClass<const T extends string>(className: T) {
  document.body.classList.add(className)
  
  onCleanup(() => {
    document.body.classList.remove(className)
  })
}

export function useBodyToggableClass<const T extends string>(className: T) {
  return (state: boolean) => {
    if (state) {
      document.body.classList.add(className)
    } else {
      document.body.classList.remove(className)
    }
  }
}