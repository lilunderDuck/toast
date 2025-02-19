import { type Accessor, createContext, createSignal, type ParentProps, Setter, useContext } from "solid-js"
// ...
import { createBlocks, type IBlockUtils } from "./blocks"
import type { IBlockSetting, EditorDocumentData, IBlockData } from "./blockData"
import { createButtonRow, IButtonRowUtils } from "./buttonRow"
import { editor_log } from "../utils"
import { 
  createTextBlock, 
  createTodoBlock 
} from "../tools"
import { EditorEvent } from "./event"
import { createEvent } from "~/utils"

type DefaultBlockSetting = {
  setting$: IBlockSetting<any>
  type$: number
}

export interface IEditorContext {
  blockSetting$: Record<number, IBlockSetting<any>>
  event$: EditorEvent
  defaultBlock$: {
    setting$: IBlockSetting<any>
    type$: number
  }
  blocks$: IBlockUtils
  buttonRow$: IButtonRowUtils
  cache$: Map<number, IBlockData[]>
  isReadonly$: Accessor<boolean>
  setIsReadonly$: Setter<boolean>
  open$(data: EditorDocumentData): void
  update$(): void
}

const Context = createContext<IEditorContext>()

export function EditorProvider(props: ParentProps) {
  const [readonly, setIsReadonly] = createSignal(false)
  const buttonRow = createButtonRow()

  const blockSetting: Record<number, IBlockSetting<any>> = {
    2: createTodoBlock()
  }

  const defaultBlock: DefaultBlockSetting = {
    setting$: createTextBlock(),
    type$: 1
  }

  blockSetting[defaultBlock.type$] = defaultBlock.setting$
  const block = createBlocks(buttonRow, () => blockSetting)

  block.insert$(null, defaultBlock.type$, defaultBlock.setting$.defaultValue$)

  const event = createEvent()
  const cache = new Map()
  let previousOpenedDocumentId = -1

  editor_log("Created with block setting", blockSetting)

  return (
    <Context.Provider value={{
      blocks$: block,
      blockSetting$: blockSetting,
      defaultBlock$: defaultBlock,
      buttonRow$: buttonRow,
      event$: event,
      cache$: cache,
      isReadonly$: readonly,
      setIsReadonly$: setIsReadonly,
      open$(data) {
        event.emit$('editor__onSwitching', cache.get(previousOpenedDocumentId))
        editor_log('Deleting previous cache data from memory:', previousOpenedDocumentId)
        cache.delete(previousOpenedDocumentId)
        editor_log('New data will be added now')
        
        block.setData$(data.content)
        if (data.content.length === 0) {
          editor_log('The provided document', data, 'has no block data in it, spawning the default block...')
          block.insert$(null, defaultBlock.type$, defaultBlock.setting$.defaultValue$)
        }
        
        cache.set(data.id, data.content)
        previousOpenedDocumentId = data.id
        editor_log('Finished')
      },
      update$() {
        if (previousOpenedDocumentId === -1) return
        event.emit$('editor__onUpdate', {
          id: previousOpenedDocumentId,
          content: block.data$()
        })
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useEditorContext() {
  return useContext(Context)!
}