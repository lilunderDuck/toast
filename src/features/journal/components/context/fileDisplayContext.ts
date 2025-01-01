import { createSignal, type Accessor, type Component } from "solid-js"
// ...
import { fetchIt } from "~/utils"
import { JOURNAL_GROUP_ROUTE, JournalApi } from "~/api/journal"
// ...
import { getCurrentJournalGroupId, insertBefore, isFolder, TreeNode } from "../../utils"

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

export function createFileDisplay(): IFileDisplayContext {
  const [tree, setTree] = createSignal<TreeNode[]>([])

  let treeCache = tree()
  let options: IFileDisplayOptions
  const updateTree = async() => {
    setTree(treeCache)
    await fetchIt<Partial<JournalApi.IGroupData>>('PATCH', `${JOURNAL_GROUP_ROUTE}?id=${getCurrentJournalGroupId()}`, {
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