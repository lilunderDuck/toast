import { 
  type Accessor,
  createContext, 
  createSignal, 
  onMount, 
  type ParentComponent, 
  type ParentProps, 
  useContext, 
  type VoidComponent 
} from "solid-js"
// ...
import { useResource } from "~/hook"
// ...
import { 
  type FileNodeProps, 
  type Tree, 
  type AnyTreeNode, 
  FileNodeType, 
  isFolder,
  type NodeData
} from "../utils"
import { createLog } from "~/features/debug"

// unnecessarily generic code stuff

type NodeComponentMapping<T extends FileNodeProps, U extends FileNodeProps> = {
  FileComponent$: VoidComponent<T>
  FolderComponent$: ParentComponent<U>
}

interface IFileDisplayProviderProps<
  T extends FileNodeProps,
  U extends FileNodeProps
> extends NodeComponentMapping<T, U> {
  load$(): Promise<{
    tree$: Tree,
    dataMapping$: Record<string | number, NodeData<T | U>>
  }>
  onOpen$(type: FileNodeType, data: NodeData<T | U>): any
  onUpdate$(newTree: Tree): void
}

interface IFileDislayInternals<
  T extends FileNodeProps,
  U extends FileNodeProps
> extends NodeComponentMapping<T, U> {
  isUpdating$: Accessor<boolean>
  isLoading$: Accessor<boolean>
  tree$: Accessor<Tree>
  getDataMapping$(): Record<string | number, NodeData<T | U>>
  callOnOpenEvent$: IFileDisplayProviderProps<T, U>["onOpen$"]
}

interface IFileDisplayContext<
  T extends FileNodeProps,
  U extends FileNodeProps
> {
  internal$: IFileDislayInternals<T, U>
  add$(node: AnyTreeNode, toFolder: number | 'root', data: NodeData<T | U>): void
  replaceTree$(whichFolderId: number | 'root', tree: Tree): void
}

// Really don't want to fix type errors, "<any, any>" is here for a reason.
const Context = createContext<IFileDisplayContext<any, any>>()

//debug-start
const fileDisplayLog = createLog("file display", "#827e0d", "#bab516")
//debug-end

export function FileDisplayProvider<
  T extends FileNodeProps,
  U extends FileNodeProps
>(
  props: ParentProps<IFileDisplayProviderProps<T, U>>
) {
  const [tree, setTree] = createSignal<Tree>([])
  const [isUpdating, setIsUpdating] = createSignal(false)

  let dataMapping = {}
  let treeCache: Tree = []
  const { isLoading$, fetch$ } = useResource(async() => {
    const data = await props.load$()
    treeCache = data.tree$
    dataMapping = data.dataMapping$
    update(false)
    //debug-start
    fileDisplayLog.log("Data fetched")
    //debug-end
    return data
  })

  onMount(fetch$)
  
  const update = async(shouldCallEvent: boolean = true) => {
    setIsUpdating(true)
    const newTree = treeCache
    setTree(newTree)
    setIsUpdating(false)
    if (shouldCallEvent) {
      props.onUpdate$(newTree)
    }
    // await api_updateJournalVirturalFileTree(thisGroup.id, newTree)
    //debug-start
    fileDisplayLog.log('updated, tree ->', treeCache, dataMapping)
    //debug-end
  }

  const add = (node: AnyTreeNode, toFolder: number | 'root', data: NodeData<T | U>) => {
    if (toFolder === 'root') {
      treeCache.push(node)
      dataMapping[data.id] = data
      return update()
    }

    const thisFolder = find(toFolder)
    if (!thisFolder) {
      //debug-start
      fileDisplayLog.error("Could not insert", node, "to", toFolder)
      //debug-end
      return 
    }

    if (!isFolder(thisFolder)) {
      //debug-start
      fileDisplayLog.error(toFolder, "is not a folder")
      //debug-end
      return
    }

    thisFolder.child.push(node)
    dataMapping[data.id] = data
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
      fileDisplayLog.log('replace', whichFolderId, "with", tree)
      //debug-end
      return update()
    }

    const shouldBeAFolder = find(whichFolderId)
    //debug-start
    if (!shouldBeAFolder) {
      fileDisplayLog.error("could not find node", whichFolderId)
      return 
    }
    
    if (!isFolder(shouldBeAFolder)) {
      fileDisplayLog.error(shouldBeAFolder, "is not a folder")
      return 
    }
    //debug-end

    //debug-start
    fileDisplayLog.log('replace', whichFolderId, "with", tree)
    //debug-end

    shouldBeAFolder.child = tree
    update()
  }

  return (
    <Context.Provider value={{
      add$: add,
      replaceTree$: replaceTree,
      internal$: {
        isLoading$,
        callOnOpenEvent$: props.onOpen$,
        tree$: tree,
        isUpdating$: isUpdating,
        FileComponent$: props.FileComponent$,
        FolderComponent$: props.FolderComponent$,
        getDataMapping$: () => dataMapping
      }
    } as IFileDisplayContext<T, U>}>
      {props.children}
    </Context.Provider>
  )
}

export function useFileDisplayContext() {
  return useContext(Context)!
}