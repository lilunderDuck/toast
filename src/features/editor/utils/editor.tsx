import { Component } from "solid-js"

export function createToolbox(name: string, icon: string) {
  return { name, icon }
}

export type BlockComponentProps<T extends {}> = T & {
  readOnly: true
}

export type AnyBlockComponent<T extends {} = {}> = Component<BlockComponentProps<T>>