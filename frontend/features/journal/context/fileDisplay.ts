import { createSignal, type Component } from "solid-js"
// ...
import { 
  IJournalCategoryData,
  IJournalData,
  JournalType,
  api_updateJournalVirturalFileTree,
} from "~/api/journal"
import { journalLog } from "~/features/debug"
// ...
import type { JournalSessionStorage } from "./JournalContext"
import { AnyVirTreeNode, ClientData, createFileNodeData, createFolderNodeData, isFolder, Tree } from "../utils"
import { JournalEvent } from "./event"

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

export function createFileDisplay(
  thisSessionStorage: JournalSessionStorage,
  event: JournalEvent
) {
  const [tree, setTree] = createSignal<Tree>([])
  const [isUpdating, setIsUpdating] = createSignal(false)

  let treeCache: Tree = []
  
  let mapping: TreeMappingData = {}
  
  const update = async() => {
    const thisGroup = thisSessionStorage.get$('currentGroup')
    setIsUpdating(true)
    const newTree = treeCache
    setTree(newTree)
    setIsUpdating(false)
    await api_updateJournalVirturalFileTree(thisGroup.id, newTree)
    //debug-start
    journalLog.logLabel("file display", 'updated, tree ->', treeCache)
    //debug-end
  }

  const add = (node: AnyVirTreeNode, toFolder: number | 'root') => {
    if (toFolder === 'root') {
      treeCache.push(node)
      return update()
    }

    const thisFolder = find(toFolder)
    if (!thisFolder) {
      //debug-start
      journalLog.errorLabel("file display", "Could not insert", node, "to", toFolder)
      //debug-end
      return 
    }

    if (!isFolder(thisFolder)) {
      //debug-start
      journalLog.errorLabel("file display", toFolder, "is not a folder")
      //debug-end
      return
    }

    thisFolder.child.push(node)
    return update()
  }

  const find = (nodeId: number, child: Tree = treeCache) => {
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

  const replaceTree = (whichFolderId: number | 'root', tree: Tree) => {
    if (whichFolderId === 'root') {
      treeCache = tree
      //debug-start
      journalLog.logLabel("file display", 'replace', whichFolderId, "with", tree)
      //debug-end
      return update()
    }

    const shouldBeAFolder = find(whichFolderId)
    //debug-start
    if (!shouldBeAFolder) {
      journalLog.errorLabel("file display", "could not find node", whichFolderId)
      return 
    }
    
    if (!isFolder(shouldBeAFolder)) {
      journalLog.errorLabel("file display", shouldBeAFolder, "is not a folder")
      return 
    }
    //debug-end

    //debug-start
    journalLog.logLabel("file display", 'replace', whichFolderId, "with", tree)
    //debug-end

    shouldBeAFolder.child = tree
    update()
  }

  const wrappedSetTree = (tree: Tree, data: ClientData["list"]) => {
    mapping = data ?? {}
    treeCache = tree
    update()
    //debug-start
    journalLog.logLabel("file display", "Tree updated with", tree, data)
    //debug-end
  }

  event.on$("journal__createdJournal$", (type, data) => {
    const newFileNode = type === JournalType.journal ? 
      createFileNodeData(data.id) : 
      createFolderNodeData(data!.id)
    // ...
    mapping[data.id] = data
    add(newFileNode, 'root')
  })
  
  return {
    treeSignal$: tree,
    isLoading$: createSignal(false),
    isUpdating$: isUpdating,
    add$: add,
    replaceTree$: replaceTree,
    setTree$: wrappedSetTree,
    get dataMapping$() {
      return mapping
    }
  }
}