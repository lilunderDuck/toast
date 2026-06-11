import { onCleanup } from "solid-js"

export function useBodyClass<const T extends string>(className: T) {
  document.body.classList.add(className)
  
  onCleanup(() => {
    document.body.classList.remove(className)
  })
}