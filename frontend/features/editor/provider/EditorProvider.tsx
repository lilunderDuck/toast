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
import { createEvent, createStorage, debounce, type IEvent, type IStorage } from "~/utils"
import { type SolidEditor, useEditor } from '~/libs/solid-tiptap-renderer'
// ...
import { getExtensions } from './extensions'

export type EditorSessionStorage = IStorage<{
  currentBlock: number
}>

export interface IEditorProviderProps {
  id$: number
}

export type EditorData = {
  id: number
  content: JSONContent
}

export type EditorEvent = IEvent<{
  editor__onSwitching$: (oldData: EditorData) => any
  editor__onUpdate$: (data: EditorData) => any
}>

export interface IEditorContext {
  editor$: Accessor<SolidEditor>
  setIsReadonly$(state: boolean): void
  isReadonly$: Accessor<boolean>
  open$(data: EditorData): void
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