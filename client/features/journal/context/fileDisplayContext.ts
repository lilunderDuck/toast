import { createSignal, type Accessor, type Component } from "solid-js"
// ...
import { 
  VirFileTree,
  api_updateJournalVirturalFileTree,
  createVirTree
} from "~/api/journal"
// ...
import type { JournalSessionStorage } from "./JournalContext"

type TreeNodeType = 'file' | 'folder'

export interface IFileDisplayOptions {
  componentLookup: Record<TreeNodeType, Component>
  dataLookup: Map<number, any>
  onClick: (type: TreeNodeType, id: number, data: {}) => void
}

export interface IFileDisplayContext extends ReturnType<typeof createVirTree> {
  treeSignal$: Accessor<VirFileTree.Tree>
}

export function createFileDisplay(thisSessionStorage: JournalSessionStorage): IFileDisplayContext {
  const [tree, setTree] = createSignal<VirFileTree.Tree>([])

  const thisGroup = thisSessionStorage.get$('currentGroup')
  const treeCache = createVirTree("default", () => {
    const newTree = treeCache.tree$.data
    setTree(newTree)
    api_updateJournalVirturalFileTree(thisGroup.id, newTree)
  })
  
  return {
    treeSignal$: tree,
    ...treeCache
  }
}