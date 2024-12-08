import { 
  Accessor,
  createContext, 
  createSignal, 
  type ParentProps, 
  type Setter, 
  useContext 
} from "solid-js"
import EditorJS, { type OutputBlockData } from "@editorjs/editorjs"
// ...
import { createEvent, IEvent } from "~/utils"
// ...
import { getBlocksTextLength, getBlocksWordCount } from "../utils"

export type EditorData = {
  id: string
  content: OutputBlockData[]
}

export type OnEditorSwitchingEvent =  (previous: EditorData | null, current: EditorData) => any
export type OnEditorUpdateEvent = (data: EditorData) => any

export type ThisEditorEvent = {
  /**Fired when the editor is switching to another "document", usually by calling
   * `ThisEditor.$open()`
   * @param previous  the previous editor JSON data. If there's no previous data,
   * it returns `null`
   * @param current   the new editor JSON data
   * @event
   */
  editor_onSwitching: OnEditorSwitchingEvent
  /**Fired everytime when you type something onto the editor.
   * 
   * This event existed to add the auto-save functionality. I have no idea how
   * to make it efficient, so... here you go
   * @param data the editor JSON data
   * @event
   */
  editor_onUpdate: OnEditorUpdateEvent
  editor_onTyping: () => void
}

export interface IThisEditorProviderContext {
  $editorInstance?: EditorJS
  $save(): Promise<EditorData>
  $event: IEvent<ThisEditorEvent>
  /**Editor's cache data */
  $cache: Map<string, EditorData["content"]>
  /**Tracks whether the editor is editable. */
  $setIsEditable(setter: Setter<boolean>): void
  $isEditable: Accessor<boolean>
  $charsCount: Accessor<number>
  $wordsCount: Accessor<number>
  $updateCharsAndWordsCount(data: EditorData["content"]): void
  /**Opens a new editor with the specified data.
   * @param data the editor JSON data.
   */
  $open(data: EditorData): void
}

const Context = createContext<IThisEditorProviderContext>()

export function ThisEditorProvider(props: ParentProps) {
  const [isEditable, setIsEditable] = createSignal(true)
  const [$wordsCount, $setWordsCount] = createSignal(0)
  const [$charsCount, $setCharsCount] = createSignal(0)
  const $updateCharsAndWordsCount = (savedData: EditorData["content"]) => {
    $setCharsCount(getBlocksTextLength(savedData))
    $setWordsCount(getBlocksWordCount(savedData))
    console.log('[editor] total chars and words count updated')
  }

  const event = createEvent<ThisEditorEvent>()
  const cache = new Map()
  let editorInstance: EditorJS
  let lastData: EditorData | null = null

  return (
    <Context.Provider value={{
      $event: event,
      $cache: cache,
      set $editorInstance(instance: EditorJS) {
        editorInstance = instance
      },
      get $editorInstance() {
        console.assert(editorInstance, '[editor] editor instance should not be undefined')
        return editorInstance
      },
      $setIsEditable(setter) {
        setIsEditable(prev => {
          const newState = setter(prev)
          editorInstance?.readOnly.toggle(!newState)
          console.log('[editor] readonly:', newState)
          return newState
        })
      },
      $charsCount,
      $wordsCount,
      $updateCharsAndWordsCount,
      $isEditable: isEditable,
      $open(data) {
        event.$emit('editor_onSwitching', lastData, data)
    
        editorInstance!.render({
          blocks: data.content ?? []
        })
        
        lastData = data
        cache.set(data.id, data.content)
        $updateCharsAndWordsCount(data.content)
        console.log('[editor] opened', data)
      },
      async $save() {
        const content = await this.$editorInstance!.save()
        console.log('[editor] saving', lastData?.id, 'with', content.blocks)
        return {
          content: content.blocks,
          id: lastData!.id
        }
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useThisEditorContext = () => useContext(Context)!