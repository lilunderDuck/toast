import type { EditorOptions } from "@tiptap/core"
import { createSignal, onCleanup } from "solid-js"
// ...
import { SolidEditor } from "./editor"

// const useForceUpdate = (): (() => void) => {
//   const [, setValue] = createSignal(0)

//   return () => setValue((value) => value + 1)
// }

export function useEditor(options: Partial<EditorOptions> = {}) {
  const [getEditor] = createSignal(new SolidEditor(options))
  // const forceUpdate = useForceUpdate()

  // getEditor().on("transaction", forceUpdate)
  onCleanup(() => {
    getEditor().destroy()
  })

  return getEditor
}