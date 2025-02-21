import { Component } from "solid-js"

/**Interface for block data.
 * @template T you can define your block data here.
 */
export interface IBlockData<T extends {} = {}> {
  /**The unique identifier of the block. */
  id: number
  /**The type of the block. */
  type: number
  /**The data of the block. */
  data: T
}

export type BlockComponentProps<T> = {
  dataIn$: T
  blockId$: number
}

export type BlockComponent<T> = Component<BlockComponentProps<T>>

export interface IBlockSetting<T extends any> {
  /**The display name of the block. */
  displayName$: string
  /**The default value of the block data. */
  defaultValue$: T
  /**Optional icon component of the block that it should display on the block list menu. */
  iconComponent$?: Component
  /**The block component itself. */
  blockComponent$: BlockComponent<T>
}

export type EditorDocumentData = {
  /**The unique identifier of the editor document. */
  id: number
  /**The content of the editor document, represented as an array of blocks. */
  content: IBlockData[]
}