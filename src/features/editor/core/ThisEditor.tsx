import { onCleanup, onMount, ParentProps } from "solid-js"
import { createEditor, getBlocksTextLength, getBlocksWordCount } from "../utils"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { useThisEditorContext } from "./ThisEditorProvider"

const style = stylex.create({
  editor: {
    height: 'calc(100vh - 72px)',
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
export function ThisEditor(props: ParentProps) {
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
        editor.$updateCharsAndWordsCount(savedData.content)
      }
    )
  })

  onCleanup(() => {
    editor.$editorInstance?.destroy?.()
    console.log('[editor] destroyed')
  })

  const autoScrollIntoBottom = () => {
    editorRef.scrollIntoView({ behavior: "smooth", block: "end" })
    editorRef.scrollTop = editorRef.scrollHeight + 1000
  }
  
  return (
    <div
      app-scrollbar 
      app-scrollbar-vertical 
      app-invs-scrollbar 
      ref={editorRef!} 
      onKeyPress={autoScrollIntoBottom}
      {...stylex.attrs(style.editor)} 
    >
      {props.children}
    </div>
  )
}