import type { JSONContent } from '@tiptap/core'
import { 
  createContext, 
  createSignal, 
  type ParentProps, 
  useContext,
  type Accessor,
  onMount
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
  editor__onSwitching$: (oldData: EditorData) => any
  /**Fired when the editor's content is updated. 
   * @param data The updated editor data.
   */
  editor__onUpdate$: (data: EditorData) => any
}>

export interface IEditorContext {
  /**The editor instance */
  editor$: Accessor<SolidEditor>
  /**Sets the read-only state of the editor */
  setIsReadonly$(state: boolean): void
  /**Gets the current read-only state of the editor. */
  isReadonly$: Accessor<boolean>
  /**Opens a new document in the editor with the provided data. When called, 
   * `editor__onSwitching$` event will be fired.
   * @param data The data of the document to open.
   * @returns *nothing*
   */
  open$(data: EditorData): void
  /**Basically every editor event related stuff is in here. */
  event$: EditorEvent
}

const Context = createContext<IEditorContext>()

export function EditorProvider(props: ParentProps<IEditorProviderProps>) {
  const [readonly, setIsReadonly] = createSignal(false)

  const localStorageWrapper = createStorage(localStorage, `editor_${props.id$}`)
  const event: EditorEvent = createEvent()
  const editor = useEditor(({
    // @ts-ignore
    extensions: getExtensions(),
    onUpdate() {
      delayUpdate()
    },
  }))

  let currentlyOpenedId = -1
  const getCurrentData = () => ({
    content: editor().getJSON(),
    id: currentlyOpenedId
  })

  const delayUpdate = debounce(() => {
    event.emit$('editor__onUpdate$', getCurrentData())
  }, 1000)

  onMount(() => {
    setIsReadonly(localStorageWrapper.get$('delete') ?? false)
  })
  
  return (
    <Context.Provider value={{
      editor$: editor,
      setIsReadonly$(state) {
        setIsReadonly(state)
        localStorageWrapper.set$('readonly', state)
        editor().setEditable(!state)
      },
      isReadonly$: readonly,
      open$(data) {
        if (currentlyOpenedId === data.id) {
          return console.log("already opened")
        }
        
        if (currentlyOpenedId !== -1) {
          event.emit$('editor__onSwitching$', getCurrentData())
        }

        console.log("incoming json data", data)
        currentlyOpenedId = data.id
        editor().commands.setContent(data.content, true, undefined, {
          errorOnInvalidContent: true
        })
      },
      event$: event
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useEditorContext() {
  return useContext(Context)!
}