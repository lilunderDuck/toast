import { Accessor, createSignal, Setter } from "solid-js"
// ...
import { array_insert, getRandomNumberFrom, thisArrayObjects } from "~/common"
import { editorLog } from "~/features/debug"
// ...
import type { IBlockData } from "./blockData"
import type { IButtonRowUtils } from "./buttonRow"
import type { IEditorContext } from "./EditorProvider"

export interface IBlockUtils {
  /**The block data */
  data$: Accessor<IBlockData[]>
  /**A setter to set the block data manually */
  setData$: Setter<IBlockData[]>
  /**Inserts a new block.
   * @param beforeBlockId the block id of the block to insert before, set it to `null` to insert at the end.
   * @param type the type of the new block.
   * @param someData optional data for the new block.
   * @returns *nothing*
   */
  insert$(beforeBlockId: number | null, type: number, someData?: any): void
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
}

export function createBlocks(
  buttonRow: IButtonRowUtils,
  blockSetting: () => IEditorContext["blockSetting$"],
  updateData: () => void
): IBlockUtils {
  const [data, setData] = createSignal<IBlockData[]>([])

  const create = (type: number, data?: any): IBlockData => {
    return {
      type: type,
      id: getRandomNumberFrom(1, 999_999_999),
      data: data ?? {}
    }
  }

  const insert: IBlockUtils["insert$"] = (beforeBlockId, type, someData) => {
    if (!someData) {
      const thisBlockSetting = blockSetting()[type]
      someData = thisBlockSetting.defaultValue$
    }

    const newData = create(type, someData)
    if (!beforeBlockId) {
      //debug-start
      editorLog.log("(1) inserting block type", type, "with data", someData, "on the bottom with", someData)
      //debug-end
      setData(prev => [...prev, newData])
      updateData()
      return
    }
    
    const blockData = data()
    const arrayObject = thisArrayObjects(blockData)
    const [, index] = arrayObject.find$(it => it.id === beforeBlockId)
    if (blockData.length - 1 === index) {
      //debug-start
      editorLog.log("(2) inserting block type", type, "with data", someData, "on the bottom with", someData)
      //debug-end
      setData(prev => [...prev, newData])
      updateData()
      return 
    }
    
    //debug-start
    editorLog.log("(3) inserting block type", type, "with data", someData, "before block", beforeBlockId)
    //debug-end
    array_insert(blockData, index, newData)
    setData(blockData)
    updateData()
  }

  const saveBlockData: IBlockUtils["saveBlockData$"] = (blockId, data) => {
    setData(prev => {
      const arrayObjects = thisArrayObjects(prev)
      const [dataPrev, index] = arrayObjects.find$(it => it.id === blockId)
      prev[index] = {
        ...dataPrev,
        data: data
      }

      return prev
    })

    updateData()
    //debug-start
    editorLog.log("saved block data", blockId, "with", data)
    //debug-end
  }
  
  const deleteBlock: IBlockUtils["delete$"] = (blockId) => {
    setData(prev => thisArrayObjects(prev).remove$('id', blockId))
    updateData()
    //debug-start
    editorLog.log("block", blockId, "deleted")
    //debug-end
  }
  
  return {
    data$: data,
    setData$: setData,
    insert$: insert,
    save$: data,
    saveBlockData$: saveBlockData,
    delete$: deleteBlock
  }
}