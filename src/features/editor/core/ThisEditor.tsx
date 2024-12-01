import { onCleanup, onMount } from "solid-js"
import { createEditor } from "../utils"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { useThisEditorContext } from "./ThisEditorProvider"

const style = stylex.create({
  editor: {
    height: '100%',
    paddingInline: 10
  }
})

/**This is the editor component itself.
 * 
 * It already comes with the editor content, bubble menu and floating menu. 
 * Also, everytime you type, it updates both of the word and charater counts.
 * 
 * @note Make sure to wrap it around `<ThisEditorProvider />`
 * @returns `JSX.Element`, it is a `solid` component, you know?
 * @see {@link ThisEditorProvider}
 * @see {@link useThisEditorContext}
 */
export function ThisEditor() {
  let editorRef: HTMLDivElement
  const editor = useThisEditorContext()
  
  onMount(() => {
    editor.$editorInstance = createEditor(
      editorRef, 
      false, 
      async() => {
        const savedData = await editor.$save()
        editor.$event.$emit('editor_onUpdate', savedData)
        editor.$cache.set(savedData.id, savedData.content)
      }
    )
  })

  onCleanup(() => {
    editor.$editorInstance?.destroy()
  })
  
  return (
    <div
      app-scrollbar 
      app-scrollbar-vertical 
      app-invs-scrollbar 
      ref={editorRef!} 
      {...stylex.attrs(style.editor)} 
    />
  )
}