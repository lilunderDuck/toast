import { createContext, createSignal, ParentProps, useContext, type Accessor, type Setter } from "solid-js"
import { createStore, produce } from "solid-js/store"
// ...
import { createEvent } from "~/utils"
// ...
import type { BaseTreeAdditionalData, TreeData, TreeNodeData, TreeViewUpdateTypeMap } from "./types"
import { createNode, getAllNodeIds, recursivelyFindNode } from "../utils"

interface ITreeViewContext<
  T extends BaseTreeAdditionalData = BaseTreeAdditionalData
> {
  /**Creates a new node with the provided data.
   * @param nodeType Parent or leaf node.
   * @param parentNodeId The parent node id. To add your node into the top root node,
   * pass in this constant: `TREE_VIEW_ROOT_NODE_ID`
   * @param data 
   * @see {@link TreeViewNodeType}
   */
  addNode$(nodeType: TreeViewNodeType, parentNodeId: number, data: T): void
  /**Updates the node data in the storage map.
   * @param nodeId The target node id.
   * @param newData 
   */
  editNodeData$(nodeId: number, newData: (prev: T) => Partial<T>): void
  /**Finds and removes a node from the tree hierarchy and deletes all associated metadata.
   * 
   * If `anyNodeId` is a parent node, this function will delete all metadata inside that node.
   * @param anyNodeId The target node id.
   * @param parentNodeId The parent node id, default is `TREE_VIEW_ROOT_NODE_ID`
   */
  deleteNode$(anyNodeId: number, parentNodeId?: number): void
  /**Returns the current tree data */
  data$(): TreeData<T>
  isDragging$: Accessor<boolean>
  setIsDragging$: Setter<boolean>
  /**The internal event emitter, allowing components to subscribe to granular tree update events. 
   * @internal
   */
  event$: TreeViewUpdateTypeMap<T>
  /**Triggers the main `onUpdate$()` callback.
   * @param newTree 
   * @internal
   * @see {@link ITreeViewProviderProps.onUpdate$()}
   */
  callUpdateEvent$(newTree?: TreeNodeData[]): void
}

const Context = createContext<ITreeViewContext>()

interface ITreeViewProviderProps<
  T extends BaseTreeAdditionalData
> {
  /**A callback function fired whenever the tree or its node metadata is modified. 
   * @param treeData The new tree data
   */
  onUpdate$(treeData: TreeData<T>): void
  /**The initial data structure to load the tree and storage map from. */
  data$: TreeData<T>
}

/**Manages states, update, ... and provides utilities function for the tree structure */
export function TreeViewProvider<
  T extends BaseTreeAdditionalData
>(props: ParentProps<ITreeViewProviderProps<T>>) {
  let treeCache = props.data$.tree
  const event: TreeViewUpdateTypeMap<T> = createEvent()

  const [store, setStore] = createStore(props.data$.storage)
  const [isDragging, setIsDragging] = createSignal(false)

  const callUpdateEvent: ITreeViewContext["callUpdateEvent$"] = (newTreeData) => {
    const newData = {
      storage: store,
      tree: newTreeData ?? treeCache
    }
    
    if (newTreeData) {
      treeCache = newTreeData
    }

    props.onUpdate$(newData)
    console.log("[tree view] updated tree", newData)
  }

  const add: ITreeViewContext["addNode$"] = (nodeType, parentNodeId, data: T) => {
    const nodeData = createNode(nodeType)

    // Just to make sure that I'm not accidentally do weird stuff on dev mode.
    // 
    // But... I'm already sure that this will *always* work in production.
    isDevMode && (() => {
      if (parentNodeId === TREE_VIEW_ROOT_NODE_ID) return

      const thisTree = recursivelyFindNode(parentNodeId!, treeCache)!
      console.assert(thisTree, `Could not insert to ${parentNodeId}, it must exist in the tree.`)
      console.assert(thisTree?.child, `${parentNodeId} must be a folder.`)
    })()

    setStore(nodeData.id, data)
    event.emit$(
      `${TreeViewUpdateType.CREATE_NODE}-${parentNodeId}`,
      nodeData,
      data
    )

    console.log("[tree view] added new node to tree ->")
    console.dir({ nodeType, parentNodeId, data })
  }

  const editNodeData: ITreeViewContext["editNodeData$"] = (nodeId, data) => {
    setStore(nodeId ?? TREE_VIEW_ROOT_NODE_ID, data as any)
    callUpdateEvent()
    console.log("[tree view] updated node data:", nodeId)
  }

  const deleteNode: ITreeViewContext["deleteNode$"] = (anyNodeId, parentNodeId = TREE_VIEW_ROOT_NODE_ID) => {
    const nodeData = recursivelyFindNode(anyNodeId, treeCache)
    console.assert(nodeData, `Could not find node: ${anyNodeId}.`)

    const allNodeIds = getAllNodeIds(nodeData!)
    setStore(produce((allData) => {
      for (const nodeId of allNodeIds) {
        delete allData[nodeId]
      }
    }))

    event.emit$(`${TreeViewUpdateType.REMOVE_NODE}-${parentNodeId}`, anyNodeId)

    console.log("[tree view] deleted node:", anyNodeId)
  }

  return (
    <Context.Provider value={{
      addNode$: add,
      deleteNode$: deleteNode,
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