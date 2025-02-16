import { Component } from "solid-js"

export interface IBlockData<T extends {} = {}> {
  id: number
  type: number
  data: T
}

export type BlockComponentProps<T> = {
  dataIn$: T
  blockId$: number
}

export type BlockComponent<T> = Component<BlockComponentProps<T>>

export interface IBlockSetting<T extends any> {
  displayName$: string
  defaultValue$?: T
  iconComponent$?: Component
  blockComponent$: BlockComponent<T>
}