import { onCleanup, onMount, ParentProps } from "solid-js"
// ...
import { mergeClassname } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from "~/assets/style/scrollbar.module.css"
import "./ThisEditor.css"
// ...
import { useThisEditorContext } from "./ThisEditorProvider"
import { createEditor } from "../utils"

const style = stylex.create({
  everything: {
    position: 'relative'
  },
  editor: {
    height: 'calc(100vh - 72px)',
    paddingInline: 10
  }
})

/**This is the editor component itself.
 * 
 * Also, everytime you type, it updates both of the word and charater counts.
 * 
 * @note Make sure to wrap it around `<ThisEditorProvider />`
 * @returns `JSX.Element`, it is a `solid` component, you know?
 * @see {@link ThisEditorProvider}
 * @see {@link useThisEditorContext}
 */
export function ThisEditor(props: ParentProps) {
  let editorLocationRef!: HTMLDivElement
  const editor = useThisEditorContext()
  
  onMount(() => {
    editor.$editorInstance = createEditor(
      editorLocationRef, 
      false, 
      async() => {
        const savedData = await editor.$save()
        editor.$event.$emit('editor__onUpdate', savedData)
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
    editorLocationRef.scrollIntoView({ behavior: "smooth", block: "end" })
    editorLocationRef.scrollTop = editorLocationRef.scrollHeight + 500
    editor.$event.$emit('editor__onTyping')
  }
  
  return (
    <div 
      onKeyPress={autoScrollIntoBottom}
      {...stylex.attrs(style.everything)}
    >
      <div 
        class={mergeClassname( 
          __scrollbarStyle.scrollbar, 
          __scrollbarStyle.scrollbarVertical, 
          __scrollbarStyle.invsScrollbar,
          stylex.attrs(style.editor)
        )}
        spellcheck={false}
        ref={editorLocationRef!} 
      />

      {props.children}
    </div>
  )
}