import { Node, nodeInputRule } from '@tiptap/core'
import { SolidNodeViewRenderer } from '../components'
import { useNodeState } from '../utils'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    emojiReplacer: {
      insertEmoji: (emoji: string) => ReturnType
    }
  }
}

const EMOJI_REGEX_SHIT = /^:[a-zA-Z0-9_]+:$/gm

export const Emoji = Node.create({
  name: 'emoji',
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,
  addAttributes() {
    return {
      emoji: {
        default: null,
      },
    }
  },
  renderText({ node }) {
    return node.attrs.emoji
  },
  addCommands() {
    return {
      insertEmoji: (emoji) => ({ tr, dispatch }) => {
        const node = this.type.create({ emoji })

        if (dispatch) {
          tr.replaceRangeWith(tr.selection.from, tr.selection.to, node)
        }

        return true
      },
    }
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: EMOJI_REGEX_SHIT,
        type: this.type,
        getAttributes: (match) => {
          console.log('match', match)
          return {
            emoji: match[1],
          }
        },
      }),
    ]
  },
  addNodeView() {
    return SolidNodeViewRenderer(EmojiNode)
  },
})

function EmojiNode() {
  const { data$ } = useNodeState()

  return (
    <span>hello {JSON.stringify(data$())}</span>
  )
}