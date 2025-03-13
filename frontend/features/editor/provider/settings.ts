import { 
  createCodeBlock,
  createGalleryBlock,
  createImageBlock, 
  createTextBlock, 
  createTodoBlock,
  createVideoBlock
} from "../tools"
import { type IBlockSetting } from "./blockData"

export type DefaultBlockSetting = {
  setting$: IBlockSetting<any>
  type$: number
}

export function loadBlockSettings() {
  const blockSetting: Record<number, IBlockSetting<any>> = {
    2: createTodoBlock(),
    3: createImageBlock(),
    4: createGalleryBlock(),
    5: createCodeBlock(),
    6: createVideoBlock()
  }

  const defaultBlock: DefaultBlockSetting = {
    setting$: createTextBlock(),
    type$: 1
  }

  blockSetting[defaultBlock.type$] = defaultBlock.setting$
  return { blockSetting, defaultBlock }
}