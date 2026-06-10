import { DEBUG_INFO_LABEL } from "macro-def"
import { onCleanup } from "solid-js"

export function useDocumentEventListener<T extends keyof DocumentEventMap>(
  eventName: T,
  listener: (this: Document, ev: DocumentEventMap[T]) => any, 
  options?: boolean | EventListenerOptions
) {
  const detach = () => {
    document.removeEventListener(eventName, listener, options)
    DEBUG_INFO_LABEL("DocumentEvent", "detached:", eventName)
  }
  
  document.addEventListener(eventName, listener, options)
  onCleanup(detach)
  DEBUG_INFO_LABEL("DocumentEvent", "attached:", eventName)
}