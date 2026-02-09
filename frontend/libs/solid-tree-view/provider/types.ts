import type { ParentComponent, VoidComponent } from "solid-js"
import type { IEvent } from "~/utils"

/**The structure of a single node in the tree hierarchy. */
export type TreeNodeData = {
  /**Unique identifier for the node. Used to link the node's position to 
   * its associated metadata in storage. 
   * @note if a node only have a `id` prop, it's a leaf node.
   */
  id: number
  /**An array of children nodes.
   * @note if a node also contains `child` prop, it's a parent node.
   */
  child?: TreeNodeData[]
}

/**A generic base type representing the essential metadata required for every node. 
 * Used to include any specific data into the tree.
*/
export type BaseTreeAdditionalData = {
  /**The parent node id */
  parentId: number
}

/**The entire tree view data. It combines the structure and the metadata for fast lookups. 
 * @see {@link BaseTreeAdditionalData}
 */
export type TreeData<T extends BaseTreeAdditionalData> = {
  tree: TreeNodeData[]
  /**A map that stores all node-specific metadata, indexed by the node's id. 
   * This allows for fast O(1) retrieval of data by id, 
   * decoupling the data from the rendering structure. 
   */
  storage: Record<number, T>
}

/**The standard props object passed to both `Leaf` and `Parent` components. 
 * @see {@link TreeLeafComponent}
 * @see {@link TreeParentComponent}
 * @see {@link ITreeViewComponent}
 * @see {@link BaseTreeAdditionalData}
*/
export type TreeViewComponentProps<T extends BaseTreeAdditionalData> = {
  nodeId$: number
  data$: T
}

/**Component responsible for rendering leaf node. 
 * @see {@link BaseTreeAdditionalData}
*/
export type TreeLeafComponent<T extends BaseTreeAdditionalData> = VoidComponent<TreeViewComponentProps<T>>
/**Component responsible for rendering parent node. 
 * @see {@link BaseTreeAdditionalData}
*/
export type TreeParentComponent<T extends BaseTreeAdditionalData> = ParentComponent<TreeViewComponentProps<T>>

export interface ITreeViewComponent<T extends BaseTreeAdditionalData> {
  Leaf$: TreeLeafComponent<T>
  Parent$: TreeParentComponent<T>
}

/**Basically every events releated to the tree update and stuff.
 * 
 * The reason why the event name looks so weird is that I want
 * the target updates approach rather than full tree replacement (duh).
 * @see {@link TreeViewUpdateType}
 * @see {@link BaseTreeAdditionalData}
 */
export type TreeViewUpdateTypeMap<T extends BaseTreeAdditionalData> = IEvent<{
  /**Fired when a new node is created under a specific parent ID. */
  [createEvt: `${TreeViewUpdateType.CREATE_NODE}-${number}`]: (
    nodeData: TreeNodeData,
    nodeAdditionalData: T
  ) => any
  /**Fired when the metadata of a specific node changes. */
  [updateEvt: `${TreeViewUpdateType.UPDATE_NODE}-${number}`]: (
    nodeAdditionalData: T
  ) => any
  /**Fired when a specific node is deleted. */
  [removeEvt: `${TreeViewUpdateType.REMOVE_NODE}-${number}`]: (
    leafNodeId: number
  ) => any
}>