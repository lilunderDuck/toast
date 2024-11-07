import { Editor } from "@tiptap/core"
import { createSignal, onCleanup, onMount } from "solid-js"
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

export namespace ThisEditor {
  const [wordsCount, setWordsCount] = createSignal(0)
  const [charsCount, setCharsCount] = createSignal(0)
  const [isEditable, setIsEditable] = createSignal(0)

  export const $wordsCount = wordsCount
  export const $charsCount = charsCount
  export const $isEditable = isEditable

  export type Ref = {
    ref?: HTMLDivElement
    $editor: () => Editor
  }

  let editorInstance: Editor | undefined
  let lastData: EditorData | null = null
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
        true, 
        onEditorUpdate
      )
    })
  
    onCleanup(() => {
      editorInstance?.destroy()
    })
    
    return (
      <>
        <div ref={editorRef!} {...stylex.attrs(style.editor)} id={__style.editor}></div>
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

  function updateCharAndWordCount() {
    const storage = editorInstance?.storage.characterCount
    setCharsCount(storage?.characters())
    setWordsCount(storage?.words())
  }

  export let $onSwitching: OnEditorSwitchingEvent = () => {}
  export let $onUpdate: OnEditorUpdateEvent = () => {}

  export function $open(data: EditorData) {
    $onSwitching(lastData, data)
    editorInstance?.commands.setContent(data.content)

    lastData = data
  }

  function getEditorJSONData() {
    return editorInstance?.getJSON()
  }
}