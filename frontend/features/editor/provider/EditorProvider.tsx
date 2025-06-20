import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Placeholder from '@tiptap/extension-placeholder'
import { Color } from '@tiptap/extension-color'
import type { Content } from '@tiptap/core'
import { createLowlight, common } from 'lowlight'
import { 
  createContext, 
  createSignal, 
  type ParentProps, 
  useContext,
  onCleanup,
  type Accessor,
  onMount
} from "solid-js"
// ...
import { createEvent, createStorage, debounce, IEvent, type IStorage } from "~/utils"
// ...
import { type SolidEditor, useEditor } from '../components'
import { Emoji } from '../extensions'

export type EditorSessionStorage = IStorage<{
  currentBlock: number
}>

export interface IEditorProviderProps {
  id$: number
}

export type EditorData = {
  id: number
  content: Content
}

export type EditorEvent = IEvent<{
  editor__onSwitching$: (data: EditorData) => any
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
  const lowlight = createLowlight(common)
  const event: EditorEvent = createEvent()
  const editor = useEditor(({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Subscript,
      Superscript,
      Highlight,
      Link,
      Underline,
      Table.configure({
        resizable: true
      }),
      Placeholder.configure({
        placeholder(props) {
          // console.log("hitting node", props.node.type)
          return "type something..."
        },
      }),
      TableCell,
      TableHeader,
      TableRow,
      TaskItem,
      TaskList,
      Color,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "txt",
        exitOnArrowDown: false,
      }),
      // ------- custom extension zone -------
      Emoji
    ],
    content: `Empty`,
    onUpdate() {
      delayUpdate()
    },
  }))

  let currentData: EditorData
  const delayUpdate = debounce(() => {
    currentData.content = editor().getJSON()
    event.emit$('editor__onUpdate$', currentData)
  }, 1000)

  onCleanup(() => {
    editor().destroy()
  })

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
        if (currentData) {
          currentData.content = editor().getJSON()
          event.emit$('editor__onSwitching$', currentData)
        }

        editor().commands.setContent(data.content, false)
        currentData = data
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