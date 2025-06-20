import { Plugin } from "prosemirror-state"
// ...
import { META_ALLOW_INTENTIONAL_DELETION } from "./nodeState"

export function dontDeleteThisNode(nodeName: string) {
  return new Plugin({
    filterTransaction(tr, state) {
      if (tr.getMeta(META_ALLOW_INTENTIONAL_DELETION) === true) {
        console.log(`Deletion of '${nodeName}' allowed by explicit meta flag.`)
        return true
      }

      if (!tr.docChanged) {
        return true // No document changes, so allow
      }

      console.time("dispatch")
      // Check if any step in the transaction deletes or replaces the target node
      let shouldPreventDelete = false
      for (const step of tr.steps) {
        if (['replace', 'replaceAround'].includes(step.jsonId)) {
          continue
        }

        const from = step.from, to = step.to
        // Iterate over the range being deleted/replaced in the *old* document state
        // to see if our node type is entirely contained within that range
        state.doc.nodesBetween(from, to, (node, nodePosition) => {
          // Check if the entire node is being deleted or replaced
          const isNodeBeingReplaced = nodePosition >= from && (nodePosition + node.nodeSize) <= to
          if (node.type.name === nodeName || isNodeBeingReplaced) {
            shouldPreventDelete = true
            return // Stop iterating, we found a deletion
          }
        })
      }

      console.timeEnd("dispatch")

      if (shouldPreventDelete) {
        console.warn(`Prevented deletion of '${nodeName}' node.`)
        return false // Block the transaction
      }

      return true // Allow the transaction
    },
    // This part helps prevent node from being deleted via selection and then backspace/delete
    // It's less about the transaction and more about what the editor allows.
    // For `selectable: true`, the above `filterTransaction` is usually enough.
    // However, if the user tries to drag a node out, or cut it, this is a fallback.
    appendTransaction: (transactions, oldState, newState) => {
      // If a transaction was appended that resulted in our node being gone, revert it.
      // This is a more aggressive check, useful if `filterTransaction` might be bypassed.
      // For `selectable: true` and `draggable: true`, a cut/drag might use a different mechanism.
      // However, for basic backspace/delete, `filterTransaction` is usually sufficient.
      // Let's rely primarily on filterTransaction for simplicity in this demo.
      return null
    }
  })
}