import { onMount } from "solid-js"
import { useEditorContext } from "../provider"

export function EditorView() {
  const { instance$ } = useEditorContext()

  onMount(() => {
    instance$.create()
  })

  return (
    <div id="editor__main" />
  )
}