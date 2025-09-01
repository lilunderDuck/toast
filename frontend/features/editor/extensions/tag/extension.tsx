import { type Attribute, InputRule, Node } from "@tiptap/core"
// ...
import { SolidNodeViewRenderer } from "~/libs/solid-tiptap-renderer"
// ...
import { insertNodeAtCurrentPosition } from "../../utils"
import TagNodeView from "./node"

export type TagAttribute = {
  name: string
  color?: string
}

export const TagExtension = Node.create<TagAttribute>({
  name: 'tag',
  group: 'inline',
  content: 'inline*',
  inline: true,
  atom: true,
  selectable: false,
  addAttributes(): Record<keyof TagAttribute, Attribute> {
    return {
      name: {
        default: ''
      },
      color: {
        default: "var(--gray10)",
      }
    }
  },
  addInputRules() {
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
  addNodeView() {
    return SolidNodeViewRenderer(TagNodeView)
  },
})