import { Editor } from "@tiptap/core"
import { createSignal, onCleanup, onMount, Setter } from "solid-js"
import { createEditor, type OnEditorUpdate } from "../utils"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./ThisEditor.module.css"
import "./TippyMenuFix.css" 
// ...
import type { 
  EditorData,
  OnEditorSwitchingEvent,
  OnEditorUpdateEvent
} from "./events"
import BubbleMenu from "./bubble-menu"
import FloatingMenu from "./floating-menu"

const style = stylex.create({
  editor: {
    height: '100%',
    paddingInline: 10
  }
})

/**### namespace `ThisEditor`
 * Everything inside here is absolutely essential to make the journal editor works.
 * 
 * Under-the-hood, it uses [`tiptap`](https://tiptap.dev/docs/editor/getting-started/overview)
 * (which already done 99% of the work to make a WYSIWYG editor. For me, it's extremely hard to make my own).
 * 
 * There is some `tiptap` port for `solid-js` (instead of having to port it manually), 
 * but it just have a very funky result, I have no clue. 
 * 
 * (or I probally didn't read their exmaple correctly, who knows?)
 */
export namespace ThisEditor {
  const [wordsCount, setWordsCount] = createSignal(0)
  const [charsCount, setCharsCount] = createSignal(0)
  const [isEditable, setIsEditable] = createSignal(true)

  /**Tracks the number of words in the editor. */
  export const $wordsCount = wordsCount
  /**Tracks the number of characters in the editor. */
  export const $charsCount = charsCount
  /**Tracks whether the editor is editable. */
  export const $isEditable = isEditable

  /**Sets the editable state of the editor and updates the internal state.
   * @param setter A function to update the editable state.
   */
  export function $setIsEditable(setter: Setter<boolean>) {
    setIsEditable(prev => {
      const newState = setter(prev)
      editorInstance?.setEditable(newState)
      return newState
    })
  }

  /**A reference type for the editor instance and its associated components. */
  export type Ref = {
    ref?: HTMLDivElement
    $editor: () => Editor
  }

  /**`tiptap`'s editor instance.
   * 
   * It'll be initialized only if you call `<ThisEditor.$Editor />`,
   * otherwise, everything breaks.
   * 
   * You can call it "The heart of the editor"
   */
  let editorInstance: Editor | undefined
  let lastData: EditorData | null = null
  /**This is the editor component itself.
   * 
   * It already comes with the editor content, bubble menu and floating menu. 
   * Also, everytime you type, it updates both of the word and charater counts.
   * 
   * @note this is a *one-instance editor*, which means if you use this component more than one,
   * it can cause many funky thing.
   * @returns `JSX.Element`, it is a `solid` component, you know?
   */
  export function $Editor() {
    let editorRef: HTMLDivElement
    let bubbleMenuRef: HTMLDivElement
    let floatingMenuRef: HTMLDivElement
  
    const onEditorUpdate: OnEditorUpdate = ({}) => {
      updateCharAndWordCount()
      if (lastData) {
        const data = getEditorJSONData()!
        lastData.content = data
        $onUpdate(lastData)
      }
    }
    
    onMount(() => {
      editorInstance = createEditor(
        editorRef, 
        bubbleMenuRef, 
        floatingMenuRef, 
        isEditable(), 
        onEditorUpdate
      )
    })
  
    onCleanup(() => {
      editorInstance?.destroy()
    })
    
    return (
      <>
        <div
          app-scrollbar 
          app-scrollbar-vertical 
          app-invs-scrollbar 
          ref={editorRef!} 
          {...stylex.attrs(style.editor)} 
          id={__style.editor}
        />
        <BubbleMenu 
          ref={bubbleMenuRef!} 
          $editor={() => editorInstance!} 
        />
        <FloatingMenu 
          ref={floatingMenuRef!} 
          $editor={() => editorInstance!} 
        />
      </>
    )
  }

  /**Updates the word and character count based on the editor's content.
   * @private
   */
  function updateCharAndWordCount() {
    const storage = editorInstance?.storage.characterCount
    setCharsCount(storage?.characters())
    setWordsCount(storage?.words())
  }

  /**Fired when the editor is switching to another "document", usually by calling
   * `ThisEditor.$open()`
   * @param previous  the previous editor JSON data. If there's no previous data,
   * it returns `null`
   * @param current   the new editor JSON data
   * @see {@link $open()}
   * @event
   */
  export let $onSwitching: OnEditorSwitchingEvent = () => {}
  /**Fired everytime when you type something onto the editor.
   * 
   * This event existed to add the auto-save functionality. I have no idea how
   * to make it efficient, so... here you go
   * @param data the editor JSON data
   * @event
   */
  export let $onUpdate: OnEditorUpdateEvent = () => {}

  /**Opens a new editor with the specified data.
   * @param data the editor JSON data.
   */
  export function $open(data: EditorData) {
    $onSwitching(lastData, data)
    editorInstance?.commands.setContent(data.content)

    lastData = data
  }

  /**Gets the current JSON representation of the editor's content.
   * @returns The JSON data of the editor.
   * @private
   */
  function getEditorJSONData() {
    return editorInstance?.getJSON()
  }
}