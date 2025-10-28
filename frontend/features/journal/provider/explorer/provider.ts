import { type Accessor, type Component, createSignal, type ParentComponent } from "solid-js"
// ...
import { createStorage, type IStorage } from "~/utils"
import type { group } from "~/wailsjs/go/models"
// ...
import { ROOT_FOLDER } from "./data"
import { createFolderNode, createFileNode } from "./data" // documentation only

/**This interface deals with everything releated to file explorer syncing,
 * rendering, and saving.
 */
export interface IFileExplorerContext {
  /**If you want to manipulate the explorer tree, access it from here. */
  tree$: IExplorerTree
  /**Options for rendering your own file and folder component. */
  components$: {
    File$: Component<{
      /**The unique identifier of this file node. */
      id: string
      /**The display name of this file. */
      name: string
    }>
    Folder$: ParentComponent<{
      onClick: EventHandler<"div", "onClick">
      /**The unique identifier of this folder node. */
      id: string
      /**The display name of this folder. */
      name: string
      /**A state to check if the folder is collapsed or expanded. */
      isCollapsed$: boolean
    }>
  }
  /**Gets the mapping of node IDs to their corresponding name. */
  getDataMapping$(): Record<string | number, any>
  /**A private internal storage used to manage the collapsed state of folders in the file explorer. */
  sessionStorage$: IStorage<Record<number, boolean>>
  /**Indicating whether the file explorer is currently being updated. 
   * @default () => false // not updating
   */
  isUpdating$: Accessor<boolean>
}

interface IExplorerTree {
  /**The explorer node data itself, representing the file tree structure. */
  data$: group.ExplorerNode[]
  /**Creates a new node within a specified folder.
   * @param nodeData The data for the new node to be created. Possible value:
   * - If it's a file node: `{ id: <unique id> }`
   * - If it's a folder node: `{ id: <unique id>, child: [] }`
   * @param toFolder The id of the folder to create the node in. If you pass in `0`,
   * the node will be inserted into the top root folder.
   * @param data Additional node data.
   * @returns *nothing*
   * @see {@link createFileNode()}
   * @see {@link createFolderNode()}
   */
  create$(nodeData: group.ExplorerNode, toFolder: string, data: any): void
  /**Replaces an entire folder's contents with a new content.
   * @param folderId The id of the folder whose contents will be replaced.
   * @param newTree The new array of nodes to replace the folder's children.
   * @returns *nothing*
   */
  replace$(folderId: string, newTree: group.ExplorerNode[]): void
}

export interface IFileExplorerProviderOptions {
  /**The components to use for rendering files and folders.*/
  components$: IFileExplorerContext["components$"]
  /**A function to fetch the initial file explorer data. */
  getData$: () => group.ExplorerData
  /**Fired when the file explorer tree is updated. 
   * 
   * Every method inside {@link IExplorerTree} will eventurally fire this callback 
   * function, if nothing on fire.
   * @param tree the updated tree data
   * @see {@link IExplorerTree}
   */
  onTreeUpdate$(tree: group.ExplorerData): any
}

export function createFileExplorerContext(options: IFileExplorerProviderOptions): IFileExplorerContext {
  const data = options.getData$()

  let treeCache: group.ExplorerNode[] = data.tree ?? []
  const treeDisplayNameCache = data.mapping ?? {}
  const [isUpdating, setIsUpdating] = createSignal(false)

  const update = async () => {
    setIsUpdating(true)
    setIsUpdating(false)
    // @ts-ignore
    options.onTreeUpdate$({
      mapping: treeDisplayNameCache,
      tree: treeCache
    })
  }

  const add = (nodeData: group.ExplorerNode, toFolder: string, data: any) => {
    console.log("Adding node", nodeData, "to", toFolder)
    if (toFolder === ROOT_FOLDER) {
      treeCache.push(nodeData)
      treeDisplayNameCache[data.id] = data.name
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
    treeDisplayNameCache[data.id] = data.name

    console.log("Inserted node", nodeData, "to", toFolder)
    return update()
  }

  const find = (id: string, child: IExplorerTree["data$"] = treeCache) => {
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

  const replaceTree = (whichFolderId: string, tree: IExplorerTree["data$"]) => {
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