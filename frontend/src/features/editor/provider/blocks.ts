import { Accessor, createSignal, Setter } from "solid-js"
// ...
import { array_insert, getRandomNumberFrom, thisArrayObjects } from "~/common"
// ...
import type { IBlockData } from "./blockData"
import { editor_log } from "../utils"
import type { IButtonRowUtils } from "./buttonRow"
import type { IEditorContext } from "./EditorProvider"

export interface IBlockUtils {
  data$: Accessor<IBlockData[]>
  setData$: Setter<IBlockData[]>
  insert$(beforeBlockId: number | null, type: number, someData?: any): void
  save$(): IBlockData[]
  saveBlockData$(blockId: number, data: any): void
  delete$(blockId: number): void
}

export function createBlocks(
  buttonRow: IButtonRowUtils,
  blockSetting: () => IEditorContext["blockSetting$"]
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
    // debugger
    if (!someData) {
      const thisBlockSetting = blockSetting()[type]
      someData = thisBlockSetting.defaultValue$
    }

    const newData = create(type, someData)
    if (!beforeBlockId) {
      editor_log("(1) inserting block type", type, "with data", someData, "on the bottom with", someData)
      return setData(prev => [...prev, newData])
    }
    
    const blockData = data()
    const arrayObject = thisArrayObjects(blockData)
    const [, index] = arrayObject.find$(it => it.id === beforeBlockId)
    if (blockData.length - 1 === index) {
      editor_log("(2) inserting block type", type, "with data", someData, "on the bottom with", someData)
      return setData(prev => [...prev, newData])
    }
    
    editor_log("(3) inserting block type", type, "with data", someData, "before block", beforeBlockId)
    array_insert(blockData, index, newData)
    setData(blockData)
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
  }

  const deleteBlock: IBlockUtils["delete$"] = (blockId) => {
    setData(prev => thisArrayObjects(prev).remove$('id', blockId))
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