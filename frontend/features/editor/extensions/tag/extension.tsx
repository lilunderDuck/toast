import { InputRule } from "@tiptap/core"
// ...
import { createEditorNode, insertNodeAtCurrentPosition } from "../../utils"
import TagNodeView from "./node"

export type TagAttribute = {
  name: string
  color?: string
}

export const TagExtension = createEditorNode<
  TagAttribute, EditorNodeType.INLINE
>(EditorNodeType.INLINE, {
  name$: 'tag',
  attributes$: () => ({
    name: {
      default: ''
    },
    color: {
      default: "var(--gray10)",
    }
  }),
  inputRules$() {
    return [
      // Tiptap extension code sometime is very confusing for my small brain.
      // Here, have some code commend, future me.
      new InputRule({
        find: /#([a-zA-Z0-9_-]+)\s$/,
        handler: ({ state, range, match }) => {
          // example text: #any-tag-name, as the input
          const { tr } = state
          const [text] = match as [string, number]
          // delete the text "#any-tag-name"
          tr.deleteRange(range.from, range.to)
          // replace it with our own tag component
          insertNodeAtCurrentPosition<TagAttribute>(this, tr, { name: text.replace("#", "") })
        },
      })
    ]
  },
  View$: TagNodeView,
})