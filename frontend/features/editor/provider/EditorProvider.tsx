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
import { createEvent, createStorage, debounce } from "~/utils"
import { type SolidEditor, useEditor } from '~/libs/solid-tiptap-renderer'
// ...
import { getExtensions } from './extensions'
import type { EditorData, EditorEventMap } from './data'

export interface IEditorProviderProps {
  /**A unique id for this editor instance. */
  id$: string
}

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
  event$: EditorEventMap
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
  const event: EditorEventMap = createEvent()
  // Local state to check which one is currently opened
  let currentlyOpenedId = ''
  // Another state to prevent the editor from saving after loaded.
  let isOpening = false

  const editor = useEditor(({
    // @ts-ignore
    extensions: getExtensions(),
    onUpdate() {
      setIsAutoSaving(true)
      setWordCount(editor().storage.characterCount.words())
      setCharCount(editor().storage.characterCount.characters())
      if (!isOpening) {
        delayUpdate()
      }

      event.emit$(EditorEvent.UPDATE_BONGO_CAT_ANIMATION)
    },
  }))

  const getCurrentData = () => ({
    content: editor().getJSON(),
    id: currentlyOpenedId
  })

  const delayUpdate = debounce(() => {
    event.emit$(EditorEvent.ON_UPDATE, getCurrentData())
    setIsAutoSaving(false)
  }, 1000)

  onMount(() => {
    setIsReadonly(localStorageWrapper.get$('readonly') ?? false)
  })

  const openDocument: IEditorContext["open$"] = (data) => {
    if (currentlyOpenedId === data.id) {
      return console.log("[editor] already opened")
    }

    if (currentlyOpenedId !== '') {
      event.emit$(EditorEvent.ON_SWITCHING, getCurrentData())
    }

    console.log("[editor] incoming json data", data)
    currentlyOpenedId = data.id
    isOpening = true
    try {
      editor().commands.setContent(data.content, true, undefined, {
        errorOnInvalidContent: true
      })
    } catch(error) {
      console.warn(error)
    }
    isOpening = false
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
      isAutoSaving$: isAutoSaving,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useEditorContext() {
  return useContext(Context)!
}