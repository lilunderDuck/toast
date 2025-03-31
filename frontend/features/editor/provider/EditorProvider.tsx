import { 
  type Accessor, 
  createContext, 
  createEffect, 
  createSignal, 
  type ParentProps, 
  useContext 
} from "solid-js"
// ...
import { editorLog } from "~/features/debug"
import { createEvent, createStorage, debounce, type IStorage } from "~/utils"
// ...
import { createBlocks, type IBlockUtils } from "./blocks"
import type { IBlockSetting, EditorDocumentData } from "./blockData"
import { createButtonRow, type IButtonRowUtils } from "./buttonRow"
import { EditorEvent } from "./event"
import { loadBlockSettings } from "./settings"

export type EditorSessionStorage = IStorage<{
  currentBlock: number
}>

export interface IEditorInternals {
  /**Editor button row utilities. */
  buttonRow$: IButtonRowUtils
  /**Editor session storage to store specific stuff. */
  sessionStorage$: EditorSessionStorage
}

export interface IEditorContext {
  /**Editor internals stuff that you should not mess around with, I think */
  internal$: IEditorInternals
  /**An object containing the block settings for each block.
   * The keys are the block IDs and the values are the block settings.
   * 
   * @see {@link IBlockSetting}
   */
  blockSetting$: Record<number, IBlockSetting<any>>
  /**Just the editor events. 
   * @see {@link EditorEvent}
   */
  event$: EditorEvent
  /**Editor block utilities. */
  blocks$: IBlockUtils
  /**The readonly state of the editor. */
  isReadonly$: Accessor<boolean>
  /**A setter to set the readonly state of the editor. */
  setIsReadonly$(value: boolean): void
  /**Opens a new editor with the specified data.
   * @param data The editor document data.
   */
  open$(data: EditorDocumentData): void
}

const Context = createContext<IEditorContext>()

export function EditorProvider(props: ParentProps) {
  const [readonly, setIsReadonly] = createSignal(false)
  const wrappedSessionStorage: EditorSessionStorage = createStorage(sessionStorage)
  const buttonRow = createButtonRow(wrappedSessionStorage)

  createEffect(() => {
    if (readonly()) {
      //debug-start
      editorLog.logLabel("internal", "force saving...")
      //debug-end
      instantDataUpdate()
    }
  })

  let currOpenedDocument: EditorDocumentData
  const instantDataUpdate = () => {
    event.emit$('editor__onUpdate', {
      id: currOpenedDocument.id,
      content: block.data$()
    })

    //debug-start
    editorLog.logLabel("internal", "document", currOpenedDocument.id, "data updated")
    //debug-end
  }

  const debouceUpdateData = debounce(instantDataUpdate, 1000)
  
  const updateData = () => {
    if (currOpenedDocument?.id === -1) return
    debouceUpdateData()
  }

  const { blockSetting, defaultBlock } = loadBlockSettings()
  const block = createBlocks(buttonRow, () => blockSetting, updateData)

  const spawnDefaultBlock = () => {
    block.insert$(null, defaultBlock.type$, defaultBlock.setting$.defaultValue$)
  }

  const event = createEvent()

  //debug-start
  editorLog.log("Created with block setting", blockSetting)
  //debug-end

  const open: IEditorContext["open$"] = (data) => {
    event.emit$('editor__onSwitching', currOpenedDocument?.content)
    //debug-start
    editorLog.log('Deleting previous cache data from memory:', currOpenedDocument?.id)
    //debug-end

    //debug-start
    editorLog.log('New data will be added now')
    //debug-end
    block.setData$(data.content)
    
    const isNoBlockLeft = data.content.length === 0
    if (isNoBlockLeft) {
      //debug-start
      editorLog.log('The provided document', data, 'has no block data in it, spawning the default block...')
      //debug-end
      spawnDefaultBlock()
    }
    
    wrappedSessionStorage.delete$('currentBlock')
    currOpenedDocument = data
    //debug-start
    editorLog.log('Finished')
    //debug-end
  }

  return (
    <Context.Provider value={{
      internal$: {
        buttonRow$: buttonRow,
        sessionStorage$: wrappedSessionStorage,
      },
      blocks$: block,
      blockSetting$: blockSetting,
      event$: event,
      isReadonly$: readonly,
      setIsReadonly$: setIsReadonly,
      open$: open
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useEditorContext() {
  return useContext(Context)!
}