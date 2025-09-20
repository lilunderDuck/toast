import type { JSONContent } from '@tiptap/core'
import {
  createContext,
  createSignal,
  type ParentProps,
  useContext,
  type Accessor,
  onMount,
  type Setter
} from "solid-js"
// ...
import { createEvent, createStorage, debounce, type IEvent } from "~/utils"
import { type SolidEditor, useEditor } from '~/libs/solid-tiptap-renderer'
// ...
import { getExtensions } from './extensions'

export interface IEditorProviderProps {
  /**A unique id for this editor instance. */
  id$: number
}

export type EditorData = {
  /**The unique identifier for the current editor's content. */
  id: number
  /**The content of the editor. */
  content: JSONContent
}

export type EditorEvent = IEvent<{
  /**Fired when the editor is switching to a new document. 
   * @param oldData The data of the document before being replaced.
   */
  [EditorEvent.ON_SWITCHING]: (oldData: EditorData) => any
  /**Fired when the editor's content is updated. 
   * @param data The updated editor data.
   */
  [EditorEvent.ON_UPDATE]: (data: EditorData) => any
  [EditorEvent.UPDATE_BONGO_CAT_ANIMATION]: () => any
}>

export interface IEditorContext {
  /**The editor instance */
  editor$: Accessor<SolidEditor>
  /**Sets the read-only state of the editor */
  setIsReadonly$: Setter<boolean>
  /**Gets the current read-only state of the editor. */
  isReadonly$: Accessor<boolean>
  /**Opens a new document in the editor with the provided data. When called, 
   * `EditorEvent.ON_SWITCHING` event will be fired.
   * @param data The data of the document to open.
   * @returns *nothing*
   */
  open$(data: EditorData): void
  /**Basically every editor event related stuff is in here. */
  event$: EditorEvent
  wordCount$: Accessor<number>
  charCount$: Accessor<number>
  isAutoSaving$: Accessor<boolean>
}

const Context = createContext<IEditorContext>()

export function EditorProvider(props: ParentProps<IEditorProviderProps>) {
  const [readonly, setIsReadonly] = createSignal(false)
  const [isAutoSaving, setIsAutoSaving] = createSignal(false)
  const [wordCount, setWordCount] = createSignal(0)
  const [charCount, setCharCount] = createSignal(0)

  const localStorageWrapper = createStorage(localStorage, `editor_${props.id$}`)
  const event: EditorEvent = createEvent()
  const editor = useEditor(({
    // @ts-ignore
    extensions: getExtensions(),
    onUpdate() {
      setIsAutoSaving(true)
      setWordCount(editor().storage.characterCount.words())
      setCharCount(editor().storage.characterCount.characters())
      delayUpdate()
      event.emit$(EditorEvent.UPDATE_BONGO_CAT_ANIMATION)
    },
  }))

  let currentlyOpenedId = -1
  const getCurrentData = () => ({
    content: editor().getJSON(),
    id: currentlyOpenedId
  })

  const delayUpdate = debounce(() => {
    event.emit$(EditorEvent.ON_UPDATE, getCurrentData())
    setIsAutoSaving(false)
  }, 1000)

  onMount(() => {
    setIsReadonly(localStorageWrapper.get$('delete') ?? false)
  })

  const openDocument: IEditorContext["open$"] = (data) => {
    if (currentlyOpenedId === data.id) {
      return console.log("already opened")
    }

    if (currentlyOpenedId !== -1) {
      event.emit$(EditorEvent.ON_SWITCHING, getCurrentData())
    }

    console.log("incoming json data", data)
    currentlyOpenedId = data.id
    editor().commands.setContent(data.content, true, undefined, {
      errorOnInvalidContent: true
    })
  }

  return (
    <Context.Provider value={{
      editor$: editor,
      setIsReadonly$(state) {
        setIsReadonly(state)
        localStorageWrapper.set$('readonly', readonly())
        editor().setEditable(readonly())
      },
      isReadonly$: readonly,
      open$: openDocument,
      event$: event,
      wordCount$: wordCount,
      charCount$: charCount,
      isAutoSaving$: isAutoSaving
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useEditorContext() {
  return useContext(Context)!
}