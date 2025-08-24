import { type Accessor, type Component, createSignal, type ParentComponent } from "solid-js"
// ...
import { createStorage, type IStorage } from "~/utils"
import { journal } from "~/wailsjs/go/models"
// ...
import { ROOT_FOLDER } from "./data"

export interface IFileExplorerContext {
  tree$: IExplorerTree
  components$: {
    File$: Component<{
      onClick: EventHandler<"div", "onClick">
      id: number
    }>
    Folder$: ParentComponent<{
      onClick: EventHandler<"div", "onClick">
      id: number
      isCollapsed$: boolean
    }>
  }
  getDataMapping$(): Record<string | number, any>
  sessionStorage$: IStorage<Record<number, boolean>>
  isUpdating$: Accessor<boolean>
  onTreeUpdate$(tree: journal.ExplorerNode[]): any
}

interface IExplorerTree {
  data$: journal.ExplorerNode[]
  create$(nodeData: journal.ExplorerNode, toFolder: number, data: any): void
  replace$(folderId: number, newTree: journal.ExplorerNode[]): void
}

export interface IFileExplorerProviderOptions {
  components$: IFileExplorerContext["components$"]
  getDataMapping$: IFileExplorerContext["getDataMapping$"]
  onTreeUpdate$(tree: journal.ExplorerNode[]): any
  getInitialTree$?: () => journal.ExplorerNode[]
}

export function createFileExplorerContext(options: IFileExplorerProviderOptions) {
  let treeCache: journal.ExplorerNode[] = options.getInitialTree$?.() ?? []
  const treeDisplayNameCache = options.getDataMapping$()
  const [isUpdating, setIsUpdating] = createSignal(false)

  const update = async () => {
    setIsUpdating(true)
    setIsUpdating(false)
    options.onTreeUpdate$(treeCache)
  }

  const add = (nodeData: journal.ExplorerNode, toFolder: number, data: any) => {
    console.log("Adding node", nodeData, "to", toFolder)
    if (toFolder === ROOT_FOLDER) {
      treeCache.push(nodeData)
      treeDisplayNameCache[data.id] = data
      return update()
    }

    const thisFolder = find(toFolder)
    if (!thisFolder) {
      console.error("Could not insert", nodeData, "to", toFolder)
      return
    }

    if (!thisFolder.child) {
      console.error(toFolder, "is not a folder")
      return
    }

    thisFolder.child.push(nodeData)
    treeDisplayNameCache[data.id] = data

    console.log("Inserted node", nodeData, "to", toFolder)
    return update()
  }

  const find = (id: number, child: IExplorerTree["data$"] = treeCache) => {
    for (const node of child) {
      if (node.id === id) {
        return node
      }

      if (node.child) {
        if (node.id === id) {
          return node
        }

        return find(id, node.child)
      }
    }

    return null
  }

  const replaceTree = (whichFolderId: number, tree: IExplorerTree["data$"]) => {
    if (whichFolderId === ROOT_FOLDER) {
      treeCache = tree
      console.log('replace', whichFolderId, "with", tree)
      return update()
    }

    const shouldBeAFolder = find(whichFolderId)
    if (!shouldBeAFolder) {
      console.error("could not find node", whichFolderId)
      return
    }

    if (!shouldBeAFolder.child) {
      console.error(shouldBeAFolder, "is not a folder")
      return
    }

    console.log('replace', whichFolderId, "with", tree)
    shouldBeAFolder.child = tree
    update()
  }

  return {
    isUpdating$: isUpdating,
    onTreeUpdate$: options.onTreeUpdate$,
    tree$: {
      create$: add,
      replace$: replaceTree,
      get data$() {
        return treeCache
      }
    },
    components$: options.components$,
    getDataMapping$: () => treeDisplayNameCache,
    sessionStorage$: createStorage(sessionStorage, "explorer")
  }
}