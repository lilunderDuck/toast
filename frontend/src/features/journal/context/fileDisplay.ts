import { createSignal, type Component } from "solid-js"
// ...
import { 
  AnyVirTreeNode,
  IJournalCategoryData,
  IJournalData,
  VirFileTree,
  api_updateJournalVirturalFileTree,
  isFolder
} from "~/api/journal"
// ...
import type { JournalSessionStorage } from "./JournalContext"
import { journalFileDisplay_error, journalFileDisplay_log } from "../utils"

type TreeNodeType = 'file' | 'folder'
type TreeMappingData = Record<number, IJournalCategoryData | IJournalData>

export interface IFileDisplayOptions {
  componentLookup: Record<TreeNodeType, Component>
  dataLookup: Map<number, any>
  onClick: (type: TreeNodeType, id: number, data: {}) => void
}

export interface IFileDisplayContext extends ReturnType<typeof createFileDisplay> {
  // ...
}

export function createFileDisplay(thisSessionStorage: JournalSessionStorage) {
  const [tree, setTree] = createSignal<VirFileTree.Tree>([])
  const [isUpdating, setIsUpdating] = createSignal(false)

  let treeCache: VirFileTree.Data = {
    list: [],
    data: []
  }
  
  let mapping: TreeMappingData = {}
  
  const update = async() => {
    const thisGroup = thisSessionStorage.get$('currentGroup')
    setIsUpdating(true)
    const newTree = treeCache.data
    setTree(newTree)
    setIsUpdating(false)
    await api_updateJournalVirturalFileTree(thisGroup.id, newTree)
    journalFileDisplay_log('updated')
  }

  const add = (node: AnyVirTreeNode, toFolder: number | 'root') => {
    if (toFolder === 'root') {
      treeCache.data.push(node)
      return update()
    }

    const thisFolder = find(toFolder)
    if (!thisFolder) {
      return journalFileDisplay_error("Could not insert", node, "to", toFolder)
    }

    if (!isFolder(thisFolder)) {
      return journalFileDisplay_error(toFolder, "is not a folder")
    }

    thisFolder.child.push(node)
    return update()
  }

  const find = (nodeId: number, child: VirFileTree.Tree = treeCache.data) => {
    for (const node of child) {
      if (node.id === nodeId) {
        return node
      }

      if (isFolder(node)) {
        if (node.id === nodeId) {
          return node
        }

        node.child

        find(nodeId, node.child)
      }
    }
 
    return null
  }

  const replaceTree = (whichFolderId: number | 'root', tree: VirFileTree.Tree) => {
    if (whichFolderId === 'root') {
      treeCache.data = tree
      return update()
    }

    const shouldBeAFolder = find(whichFolderId)
    if (!shouldBeAFolder) {
      return journalFileDisplay_error("could not find node", whichFolderId)
    }

    if (!isFolder(shouldBeAFolder)) {
      return journalFileDisplay_error(shouldBeAFolder, "is not a folder")
    }

    shouldBeAFolder.child = tree
    update()
  }

  const wrappedSetTree = (tree: VirFileTree.Tree, data: VirFileTree.ClientData["list"]) => {
    mapping = data
    treeCache.data = tree
    update()
    journalFileDisplay_log("Tree updated with", tree, data)
  }
  
  return {
    treeSignal$: tree,
    isLoading$: createSignal(false),
    isUpdating$: isUpdating,
    add$: add,
    replaceTree$: replaceTree,
    setTree$: wrappedSetTree,
    get mapping$() {
      return mapping
    }
  }
}