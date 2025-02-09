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

type TreeNodeType = 'file' | 'folder'
type TreeMappingData = Record<number, IJournalCategoryData | IJournalData>
type TreeMapping = Map<string, IJournalCategoryData | IJournalData>

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

  const thisGroup = thisSessionStorage.get$('currentGroup')
  let treeCache: VirFileTree.Data = {
    list: [],
    data: []
  }

  let mapping: TreeMapping = new Map()

  const update = async() => {
    setIsUpdating(true)
    const newTree = treeCache.data
    setTree(newTree)
    setIsUpdating(false)
    await api_updateJournalVirturalFileTree(thisGroup.id, newTree)
    console.log('[vir tree] update')
  }

  const add = (node: AnyVirTreeNode, toFolder: number | 'root') => {
    if (toFolder === 'root') {
      treeCache.data.push(node)
      return update()
    }

    const thisFolder = find(toFolder)
    if (!thisFolder) {
      return console.error("Could not insert", node, "to", toFolder)
    }

    if (!isFolder(thisFolder)) {
      return console.error(toFolder, "is not a folder")
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
      return console.error("could not find node", whichFolderId)
    }

    if (!isFolder(shouldBeAFolder)) {
      return console.error(shouldBeAFolder, "is not a folder")
    }

    shouldBeAFolder.child = tree
    update()
  }
  
  return {
    treeSignal$: tree,
    isUpdating$: isUpdating,
    add$: add,
    replaceTree$: replaceTree,
    setTree$(tree: VirFileTree.Tree, data: VirFileTree.ClientData["list"]) {
      console.log(tree)
      mapping = new Map(Object.entries(data))
      treeCache.data = tree
      update()
    },
    get mapping$() {
      return mapping
    }
  }
}