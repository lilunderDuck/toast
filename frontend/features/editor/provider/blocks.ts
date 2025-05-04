import { Accessor, createSignal, Setter } from "solid-js"
// ...
import { arrayInsert, getRandomNumberFrom, arrayObjects } from "~/utils"
import { editorLog } from "~/features/debug"
// ...
import type { IBlockData } from "./blockData"
import type { IButtonRowUtils } from "./buttonRow"
import type { IEditorContext } from "./EditorProvider"
import { DefaultBlockSetting } from "./settings"

export interface IBlockUtils {
  /**The block data */
  data$: Accessor<IBlockData[]>
  /**A setter to set the block data manually */
  setData$: Setter<IBlockData[]>
  /**Inserts a new block.
   * @param beforeBlockId the block id of the block to insert before, set it to `null` to insert at the end.
   * @param type the type of the new block.
   * @param someData optional data for the new block.
   * @param silentUpdate default: `false`, set this to `true` to prevent the editor emitting
   * `editor__onUpdate` event.
   * @returns *nothing*
   */
  insert$(beforeBlockId: number | null, type: number, someData?: any, silentUpdate?: boolean): void
  /**Saves the block data.
   * @returns The saved block data.
   */
  save$(): IBlockData[]
  /**Saves the data for a specific block.
   * @param blockId The block id of the block to save data for.
   * @param data The data to save for the block.
   * @returns *nothing*
   */
  saveBlockData$(blockId: number, data: any): void
  /**Deletes a block from the current document
   * @param blockId The block id of the block to delete. If `blockId` does not exist in
   * the current document, nothing will happen, it won't be blew up or anything.
   * @returns *nothing*
   */
  delete$(blockId: number): void
  spawnDefaultBlock$(): void
}

export function createBlocks(
  buttonRow: IButtonRowUtils,
  blockSetting: IEditorContext["blockSetting$"],
  updateData: () => void,
  defaultBlock: DefaultBlockSetting
): IBlockUtils {
  const [data, setData] = createSignal<IBlockData[]>([])

  const create = (type: number, data?: any): IBlockData => {
    return {
      type: type,
      id: getRandomNumberFrom(1, 999_999_999),
      data: data ?? {}
    }
  }

  const insertToTheBottom = (type: number, data: IBlockData, silentUpdate = false) => {
    isDevMode && editorLog.log("inserting block type", type, "with data", data, "on the bottom")
    
    setData(prev => [...prev, data])
    if (!silentUpdate) updateData()
  }

  const insert: IBlockUtils["insert$"] = (beforeBlockId, type, someData, silentUpdate = false) => {
    if (!someData) {
      const thisBlockSetting = blockSetting[type]
      someData = thisBlockSetting.defaultValue$
      isDevMode && editorLog.log("no data was given with block type:", type, ". Using the default value:", thisBlockSetting.defaultValue$)
    }

    const newData = create(type, someData)
    if (!beforeBlockId) {
      return insertToTheBottom(type, newData, silentUpdate)
    }
    
    const blocksData = data()
    const [, index] = arrayObjects(blocksData).find$(it => it.id === beforeBlockId)
    const isItTheLastBlock = blocksData.length - 1 === index
    if (isItTheLastBlock) {
      return insertToTheBottom(type, newData, silentUpdate)
    }
    
    isDevMode && editorLog.log("inserting block type", type, "with data", someData, "before block", beforeBlockId)
    
    arrayInsert(blocksData, index, newData)
    setData(blocksData)
    if (!silentUpdate) updateData()
  }

  const saveBlockData: IBlockUtils["saveBlockData$"] = (blockId, data) => {
    setData(prev => {
      const [dataPrev, index] = arrayObjects(prev).find$(it => it.id === blockId)
      prev[index] = {
        ...dataPrev,
        data: data
      }

      return prev
    })

    updateData()
    isDevMode && editorLog.log("saved block data", blockId, "with", data)
  }
  
  const deleteBlock: IBlockUtils["delete$"] = (blockId) => {
    setData(prev => arrayObjects(prev).remove$('id', blockId))
    // make sure to spawn default block if the editor has no data
    if (data().length === 0) {
      spawnDefaultBlock()
    }

    updateData()
    isDevMode && editorLog.log("block", blockId, "deleted")
  }

  const spawnDefaultBlock: IBlockUtils["spawnDefaultBlock$"] = () => {
    insert(null, defaultBlock.type$, defaultBlock.setting$.defaultValue$, true)
    isDevMode && editorLog.log("default block spawned", defaultBlock)
  }
  
  return {
    data$: data,
    setData$: setData,
    insert$: insert,
    save$: data,
    saveBlockData$: saveBlockData,
    delete$: deleteBlock,
    spawnDefaultBlock$: spawnDefaultBlock
  }
}