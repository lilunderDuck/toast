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
  type NodeData,
  A_SPECIAL_CONSTANT_THAT_SHOULD_SAVE_THE_DATA
} from "../utils"
import { __run, fileDisplayLog } from "~/features/debug"

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
  getCurrentlySelectedFolderNodeId$(): number
}

// Really don't want to fix type errors, "<any, any>" is here for a reason.
const Context = createContext<IFileDisplayContext<any, any>>()

export function FileDisplayProvider<
  T extends FileNodeProps,
  U extends FileNodeProps
>(
  props: ParentProps<IFileDisplayProviderProps<T, U>>
) {
  const [tree, setTree] = createSignal<Tree>([])
  const [isUpdating, setIsUpdating] = createSignal(false)

  let dataMapping: Record<number, any> = {}
  let treeCache: Tree = []
  const { isLoading$, fetch$ } = useResource(async() => {
    const data = await props.load$()
    treeCache = data.tree$
    dataMapping = data.dataMapping$
    update(false)
    isDevMode && fileDisplayLog.log("Data fetched")
    
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
    
    isDevMode && fileDisplayLog.log('updated, tree ->', treeCache, dataMapping)
  }

  const add = (node: AnyTreeNode, toFolder: number | 'root', data: NodeData<T | U>) => {
    if (toFolder === 'root') {
      treeCache.push(node)
      dataMapping[data.id as number] = data
      return update()
    }

    const thisFolder = find(toFolder)
    if (!thisFolder) {
      isDevMode && fileDisplayLog.error("Could not insert", node, "to", toFolder)
      return 
    }

    if (!isFolder(thisFolder)) {
      isDevMode && fileDisplayLog.error(toFolder, "is not a folder")
      return
    }

    if (thisFolder.child[0].id === A_SPECIAL_CONSTANT_THAT_SHOULD_SAVE_THE_DATA) {
      thisFolder.child[0] = node
    } else {
      thisFolder.child.push(node)
    }

    dataMapping[data.id as number] = data
    isDevMode && fileDisplayLog.error("Inserted node", node, "to", toFolder)
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

        return find(nodeId, node.child)
      }
    }
 
    return null
  }

  const replaceTree = (whichFolderId: number | 'root', tree: Tree) => {
    if (whichFolderId === 'root') {
      treeCache = tree
      isDevMode && fileDisplayLog.log('replace', whichFolderId, "with", tree)
      return update()
    }

    const shouldBeAFolder = find(whichFolderId)
    isDevMode && __run(() => {
      if (!shouldBeAFolder) {
        fileDisplayLog.error("could not find node", whichFolderId)
        return 
      }
    })
    
    if (!isFolder(shouldBeAFolder)) {
      fileDisplayLog.error(shouldBeAFolder, "is not a folder")
      return 
    }

    isDevMode && fileDisplayLog.log('replace', whichFolderId, "with", tree)
    shouldBeAFolder.child = tree
    update()
  }

  let currentOpenedId = -1
  return (
    <Context.Provider value={{
      add$: add,
      replaceTree$: replaceTree,
      getCurrentlySelectedFolderNodeId$() {
        return currentOpenedId
      },
      internal$: {
        isLoading$,
        callOnOpenEvent$(type, data) {
          props.onOpen$(type, data)
          if (type === FileNodeType.FOLDER) {
            currentOpenedId = data.id as number
          }
        },
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