import { type Accessor, createContext, createSignal, type ParentProps, type Setter, useContext } from "solid-js"
// ...
import { editorLog } from "~/features/debug"
import { createEvent, createStorage, debounce, type IStorage } from "~/utils"
// ...
import { createBlocks, type IBlockUtils } from "./blocks"
import type { IBlockSetting, EditorDocumentData, IBlockData } from "./blockData"
import { createButtonRow, type IButtonRowUtils } from "./buttonRow"
import { EditorEvent } from "./event"
import { loadBlockSettings } from "./settings"
import { compressEditorData, decompressEditorData } from "./compression"

export type EditorSessionStorage = IStorage<{
  currentBlock: number
}>

export interface IEditorContext {
  /**An object containing the block settings for each block.
   * The keys are the block IDs and the values are the block settings.
   */
  blockSetting$: Record<number, IBlockSetting<any>>
  /**Just the editor events. */
  event$: EditorEvent
  /**Editor session storage to store specific stuff. */
  sessionStorage$: EditorSessionStorage
  /**Editor block utilities. */
  blocks$: IBlockUtils
  /**Editor button row utilities. */
  buttonRow$: IButtonRowUtils
  /**Containing the cached block data for each block.
   * The keys are the block IDs and the values are the block data.
   */
  cache$: Map<number, IBlockData[]>
  /**The readonly state of the editor. */
  isReadonly$: Accessor<boolean>
  /**A setter to set the readonly state of the editor. */
  setIsReadonly$: Setter<boolean>
  /**Opens a new editor with the specified data.
   * @param data The editor document data.
   */
  open$(data: EditorDocumentData): void
  /**Updates the editor data, this is just the editor's internal method.
   * @internal
   */
  update$(): void
}

const Context = createContext<IEditorContext>()

export function EditorProvider(props: ParentProps) {
  const [readonly, setIsReadonly] = createSignal(false)
  const wrappedSessionStorage: EditorSessionStorage = createStorage(sessionStorage)
  const buttonRow = createButtonRow(wrappedSessionStorage)

  let previousOpenedDocumentId = -1
  const debouceUpdateData = debounce(() => {
    event.emit$('editor__onUpdate', {
      id: previousOpenedDocumentId,
      content: compressEditorData(block.data$())
    })

    //debug-start
    editorLog.logLabel("internal", "document", previousOpenedDocumentId, "data updated")
    //debug-end
  }, 1000)
  
  const updateData = () => {
    if (previousOpenedDocumentId === -1) return
    debouceUpdateData()
  }

  const { blockSetting, defaultBlock } = loadBlockSettings()
  const block = createBlocks(buttonRow, () => blockSetting, updateData)

  const spawnDefaultBlock = () => block.insert$(null, defaultBlock.type$, defaultBlock.setting$.defaultValue$)
  spawnDefaultBlock()

  const event = createEvent()
  const cache = new Map()

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
    block.setData$(decompressEditorData(data.content))
    
    if (data.content.length === 0) {
      //debug-start
      editorLog.log('The provided document', data, 'has no block data in it, spawning the default block...')
      //debug-end
      spawnDefaultBlock()
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
      buttonRow$: buttonRow,
      sessionStorage$: wrappedSessionStorage,
      event$: event,
      cache$: cache,
      isReadonly$: readonly,
      setIsReadonly$: setIsReadonly,
      open$: open,
      update$: updateData
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useEditorContext() {
  return useContext(Context)!
}