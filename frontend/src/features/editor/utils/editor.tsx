import type { Component, Signal } from "solid-js"

export function createToolbox(name: string, icon: string) {
  return { name, icon }
}

export type BlockComponentProps<Data extends {}> = {
  readOnly: boolean
  dataIn$: Data
  dataOut$: Signal<Data>
}

export type AnyBlockComponent<T extends {} = {}> = Component<BlockComponentProps<T>>