import { createContext, createSignal, ParentProps, useContext, type Accessor, type Setter } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { createEvent } from "~/utils"
// ...
import type { BaseTreeAdditionalData, TreeData, TreeNodeData, TreeViewUpdateTypeMap } from "./types"
import { createNode, recursivelyFindNode } from "../utils"

interface ITreeViewContext<
  T extends BaseTreeAdditionalData = BaseTreeAdditionalData
> {
  add$(nodeType: TreeViewNodeType, whichFolderId: number, data: T): void
  editNodeData$(nodeId: number, newData: (prev: T) => Partial<T>): void
  callUpdateEvent$(newTree?: TreeNodeData[]): void
  data$(): TreeData<T>
  event$: TreeViewUpdateTypeMap<T>
  isDragging$: Accessor<boolean>
  setIsDragging$: Setter<boolean>
  delete$(parentNodeId: number, nodeId: number): void
}

const Context = createContext<ITreeViewContext>()

interface ITreeViewProviderProps<
  T extends BaseTreeAdditionalData
> {
  onUpdate$(treeData: TreeData<T>): void
  data$: TreeData<T>
}

export function TreeViewProvider<
  T extends BaseTreeAdditionalData
>(props: ParentProps<ITreeViewProviderProps<T>>) {
  const treeCache = props.data$.tree
  const event: TreeViewUpdateTypeMap<T> = createEvent()

  const [store, setStore] = createStore(props.data$.storage)
  const [isDragging, setIsDragging] = createSignal(false)

  const callUpdateEvent = () => {
    props.onUpdate$({
      storage: store,
      tree: treeCache
    })
  }

  const add: ITreeViewContext["add$"] = (nodeType, whichFolderId, data: T) => {
    const nodeData = createNode(nodeType)

    // Just to make sure that I'm not accidentally do weird stuff on dev mode.
    // 
    // But... I'm already sure that this will *always* work in production.
    const shouldBeAFolder = recursivelyFindNode(whichFolderId!, treeCache!)!
    console.assert(shouldBeAFolder, `Could not insert to ${whichFolderId}, it must exist in the tree.`)
    console.assert(shouldBeAFolder.child, `${whichFolderId} must be a folder.`)

    setStore(nodeData.id, data)
    event.emit$(
      `${TreeViewUpdateType.CREATE_NODE}-${whichFolderId}`, 
      nodeData,
      data
    )
  }
  
  const editNodeData: ITreeViewContext["editNodeData$"] = (nodeId, data) => {
    setStore(nodeId ?? TREE_VIEW_ROOT_NODE_ID, data as any)
    callUpdateEvent()
  }

  const deleteNode: ITreeViewContext["delete$"] = (parentNodeId, nodeId) => {
    event.emit$(`${TreeViewUpdateType.REMOVE_NODE}-${nodeId}`)
  }

  return (
    <Context.Provider value={{
      add$: add,
      delete$: deleteNode,
      editNodeData$: editNodeData,
      callUpdateEvent$: callUpdateEvent,
      isDragging$: isDragging, 
      setIsDragging$: setIsDragging,
      data$: () => ({
        storage: store,
        tree: treeCache
      }),
      event$: event
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTreeViewContext<T extends BaseTreeAdditionalData>() {
  return useContext(Context)! as ITreeViewContext<T>
}