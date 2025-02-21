import { type DefaultBlockSetting } from "./EditorProvider"
import { createTextBlock, createTodoBlock } from "../tools"
import { type IBlockSetting } from "./blockData"

export function loadBlockSettings() {
  const blockSetting: Record<number, IBlockSetting<any>> = {
    2: createTodoBlock()
  }

  const defaultBlock: DefaultBlockSetting = {
    setting$: createTextBlock(),
    type$: 1
  }

  blockSetting[defaultBlock.type$] = defaultBlock.setting$
  return { blockSetting, defaultBlock }
}