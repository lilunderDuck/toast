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
 * @note this is a *one-instance editor*, which means if you use this component more than one,
 * it can cause many funky thing.
 * @returns `JSX.Element`, it is a `solid` component, you know?
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
        editor.$cache.set(savedData.id, savedData)
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