import { onCleanup } from "solid-js"

export function useDocumentEventListener<T extends keyof DocumentEventMap>(
  eventName: T,
  listener: (this: Document, ev: DocumentEventMap[T]) => any, 
  options?: boolean | EventListenerOptions
) {
  const detach = () => {
    document.removeEventListener(eventName, listener, options)
    console.log("Detached:", eventName)
  }

  onCleanup(detach)

  return {
    attach$: () => {
      document.addEventListener(eventName, listener, options)
      console.log("Attached:", eventName)
    },
    detach$: detach
  }
}