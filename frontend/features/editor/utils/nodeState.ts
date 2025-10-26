import { type Attrs, type SolidNodeViewContextProps, useSolidNodeView } from "~/libs/solid-tiptap-renderer"

export const META_ALLOW_INTENTIONAL_DELETION = "non-sense"

interface INodeState<Data extends Attrs> {
  /**Updates a single attribute on the current node.
   * @template T The key of the attribute to update.
   * @param key The key of the attribute to update.
   * @param value The new value for the attribute.
   * @returns *nothing*
   */
  updateAttribute$<T extends keyof Data>(key: T, value: Data[T]): void
  /**Gets the options of this node's extension. */
  options$(): any
  /**Returns whether this node is selected. */
  selected$(): boolean
  /**Gets the data/attributes of this node. */
  data$(): Data
  /**Deletes this node from the editor.
   * @returns *nothing*
   */
  delete$(): void
  state$: SolidNodeViewContextProps["state"]
}

/**A hook to access the state and attributes of a TipTap node within a `SolidNodeView`.
 * @example
 * ```tsx
 * import { Node } from '@tiptap/core'
 * 
 * type SampleNodeAttribute = {
 *   // define your node attribute here
 * }
 * 
 * export const SampleNode = Node.create({
 *   // ... node related stuff ...
 *   addNodeView: () => SolidNodeViewRenderer(() => {
 *     const { data$ } = useNodeState<SampleNodeAttribute>()
 * 
 *     return (
 *       <NodeViewWrapper>
 *         Do something with the node state here
 *       </NodeViewWrapper>
 *     )
 *   }),
 * })
 * ```
 * @template Data The type of the node's attributes.
 * @returns An object containing accessors and functions to interact with the node's state.
 */
export function useNodeState<Data extends Attrs>(): INodeState<Data> {
  const { state } = useSolidNodeView<Data>()
  const updateAttribute = <T extends keyof Data>(key: T, value: Data[T]) => {
    state().updateAttributes({ [key]: value })
  }

  const options = () => state().extension.options
  const selected = () => {
    return state().selected
  }

  const data = (): Data => {
    return state().node$.attrs
  }

  const deleteCurrentNode = () => {
    const { getPos, node, editor } = state()
    const pos = getPos()
    if (pos == undefined && pos == -1) {
      console.error("Could not get node position for deletion.")
      return
    }
    
    // Create the transaction to delete the node
    const tr = editor.state.tr.delete(pos, pos + node.nodeSize)
    // IMPORTANT: Add a meta property to signal this transaction is allowed
    tr.setMeta(META_ALLOW_INTENTIONAL_DELETION, true) // Custom flag for our plugin
    editor.view.dispatch(tr)
    console.log("Direct node deletion initiated by button. Plugin should allow this.")
  }

  return {
    updateAttribute$: updateAttribute,
    options$: options,
    selected$: selected,
    data$: data,
    state$: state,
    delete$: deleteCurrentNode
  }
}