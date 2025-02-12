import { onCleanup, onMount, ParentProps } from "solid-js"
// ...
import { debounce, mergeClassname } from "~/utils"
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
export function ThisEditor(props: ParentProps<{ class?: string }>) {
  let editorLocationRef!: Ref<"div">
  const editor = useThisEditorContext()
  
  onMount(() => {
    editor.editorInstance$ = createEditor(
      editorLocationRef, 
      false
    )
  })

  onCleanup(() => {
    editor.editorInstance$?.destroy?.()
    console.log('[editor] destroyed')
  })

  const autoScrollIntoBottom = () => {
    editorLocationRef.scrollIntoView({ behavior: "smooth", block: "end" })
    editorLocationRef.scrollTop = editorLocationRef.scrollHeight + 500
    editor.event$.emit$('editor__onTyping')
  }

  const onSlappingYourKeyboard: EventHandler<"div", "onKeyUp"> = async(keyboardEvent) => {
    // const target = keyboardEvent.target

    // don't update if you press these key
    const keyYouJustPressed = keyboardEvent.key
    if (!keyYouJustPressed) return
    
    const isContainsTheseModifierKeys = ['Control', 'Shift', 'Alt'].includes(keyYouJustPressed)
    const isContainsKeysFSomething = keyYouJustPressed[0] === 'F' && !Number.isNaN(parseInt(keyYouJustPressed[1]))

    if (
      isContainsTheseModifierKeys ||
      isContainsKeysFSomething
    ) return
    // else auto-save it
    update()
  }

  const update = debounce(editor.update$, 1500)
  
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
          stylex.attrs(style.editor),
          props
        )}
        onKeyUp={onSlappingYourKeyboard}
        spellcheck={false}
        ref={editorLocationRef!} 
      />

      {props.children}
    </div>
  )
}