import { createSignal, type Accessor, type Component } from "solid-js"
// ...
import { fetchIt } from "~/utils"
import { JOURNAL_GROUP_ROUTE, type JournalApi } from "~/api/journal"
// ...
import { insertBefore, isFolder, type TreeNode } from "../../utils"
import type { JournalSessionStorage } from "./JournalContext"

type TreeNodeType = 'file' | 'folder'

export interface IFileDisplayOptions {
  componentLookup: Record<TreeNodeType, Component>
  dataLookup: Map<string, any>
  onClick: (type: TreeNodeType, id: string, data: {}) => void
}

export interface IFileDisplayContext {
  options: IFileDisplayOptions
  setOptions(option: IFileDisplayOptions): void
  findNodeRecursively(nodeId: string, nodes: TreeNode[]): TreeNode | null
  add(node: TreeNode, toFolder: string, before?: string): void
  tree: Accessor<TreeNode[]>
  setTree(tree?: TreeNode[]): void
}

export function createFileDisplay(thisSessionStorage: JournalSessionStorage): IFileDisplayContext {
  const [tree, setTree] = createSignal<TreeNode[]>([])

  let treeCache = tree()
  let options: IFileDisplayOptions
  const updateTree = async() => {
    setTree(treeCache)
    const currentGroup = thisSessionStorage.$get('currentGroup')
    await fetchIt<Partial<JournalApi.IGroupData>>('PATCH', `${JOURNAL_GROUP_ROUTE}?id=${currentGroup.id}`, {
      tree: treeCache
    })
    console.log('Tree updated', treeCache)
  }

  const findNodeRecursively: IFileDisplayContext["findNodeRecursively"] = (nodeId, nodes) => {
    for (const node of nodes) {
      if (node === nodeId) {
        return node
      }

      if (isFolder(node)) {
        if (node.id === nodeId) {
          return node
        }

        findNodeRecursively(nodeId, node.child)
      }
    }
 
    return null
  }

  const add: IFileDisplayContext["add"] = (node, toFolder, before) => {
    console.log(`Adding node`, node, `to folder "${toFolder}" before "${before || '*nothing*'}"`)
    if (toFolder === 'root') {
      if (before) {
        treeCache = insertBefore(treeCache, node, before)
      }
      else {
        treeCache.push(node)
      }

      updateTree()
    }

    const thisExactFolder = findNodeRecursively(toFolder, treeCache)
    if (!thisExactFolder) {
      return console.log('Cannot insert', node, 'to', toFolder, 'because it\'s not exist')
    }

    if (typeof thisExactFolder === "string") {
      return console.log('Cannot insert', node, 'to', toFolder, 'because it\'s not a folder')
    }

    if (before) {
      thisExactFolder.child = insertBefore(thisExactFolder.child, node, before)
    }
    else {
      thisExactFolder.child.push(node)
    }

    updateTree()
  }
  
  return {
    findNodeRecursively,
    add,
    tree,
    get options() {
      return options!
    },
    setOptions(value) {
      options = value
    },
    setTree(tree) {
      const initalTree = tree ?? []
      setTree(initalTree)
      treeCache = initalTree
    }
  }
}