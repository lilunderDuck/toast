import { type Accessor, createContext, createSignal, type ParentProps, type Setter, useContext } from "solid-js"
// ...
import { editorLog } from "~/features/debug"
import { createEvent, createStorage, type IStorage } from "~/utils"
// ...
import { createBlocks, type IBlockUtils } from "./blocks"
import type { IBlockSetting, EditorDocumentData, IBlockData } from "./blockData"
import { createButtonRow, type IButtonRowUtils } from "./buttonRow"
import { EditorEvent } from "./event"
import { loadBlockSettings } from "./settings"

export type DefaultBlockSetting = {
  setting$: IBlockSetting<any>
  type$: number
}

export type EditorSessionStorage = IStorage<{
  currentBlock: number
}>

export interface IEditorContext {
  blockSetting$: Record<number, IBlockSetting<any>>
  event$: EditorEvent
  sessionStorage$: EditorSessionStorage
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
  const wrappedSessionStorage: EditorSessionStorage = createStorage(sessionStorage)
  const buttonRow = createButtonRow(wrappedSessionStorage)

  const { blockSetting, defaultBlock } = loadBlockSettings()
  const block = createBlocks(buttonRow, () => blockSetting)
  block.insert$(null, defaultBlock.type$, defaultBlock.setting$.defaultValue$)

  const event = createEvent()
  const cache = new Map()
  let previousOpenedDocumentId = -1

  //debug-start
  editorLog.log("Created with block setting", blockSetting)
  //debug-end

  const open: IEditorContext["open$"] = (data) => {
    event.emit$('editor__onSwitching', cache.get(previousOpenedDocumentId))
    //debug-start
    editorLog.log('Deleting previous cache data from memory:', previousOpenedDocumentId)
    //debug-end
    cache.delete(previousOpenedDocumentId)

    //debug-start
    editorLog.log('New data will be added now')
    //debug-end
    block.setData$(data.content)
    
    if (data.content.length === 0) {
      //debug-start
      editorLog.log('The provided document', data, 'has no block data in it, spawning the default block...')
      //debug-end
      block.insert$(null, defaultBlock.type$, defaultBlock.setting$.defaultValue$)
    }
    
    wrappedSessionStorage.delete$('currentBlock')
    cache.set(data.id, data.content)
    previousOpenedDocumentId = data.id
    //debug-start
    editorLog.log('Finished')
    //debug-end
  }

  return (
    <Context.Provider value={{
      blocks$: block,
      blockSetting$: blockSetting,
      defaultBlock$: defaultBlock,
      buttonRow$: buttonRow,
      sessionStorage$: wrappedSessionStorage,
      event$: event,
      cache$: cache,
      isReadonly$: readonly,
      setIsReadonly$: setIsReadonly,
      open$: open,
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