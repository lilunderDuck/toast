import { type Attrs, useSolidNodeView } from "~/libs/solid-tiptap-renderer"

export const META_ALLOW_INTENTIONAL_DELETION = "non-sense"

export function useNodeState<Data extends Attrs>() {
  const { state } = useSolidNodeView<Data>()
  const updateAttribute = <T extends keyof Data>(key: T, value: Data[T]) => {
    state().updateAttributes({ [key]: value })
  }

  const options = () => state().extension.options
  const selected = () => {
    return state().selected
  }

  const attrs = (): Data => {
    return state().node.attrs
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
    data$: attrs,
    state$: state,
    delete$: deleteCurrentNode
  }
}