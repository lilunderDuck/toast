import { type Attribute, Node } from '@tiptap/core'
// ...
import { SolidNodeViewRenderer } from '~/libs/solid-tiptap-renderer'
// ...
import { insertNodeAtCurrentPosition } from '../../utils'
import LocalEmbedNode from './node'
import { LocalEmbedProvider } from './provider'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    localEmbed$: {
      insertLocalEmbed$: () => ReturnType
    }
  }
}

export type LocalEmbedAttribute = {
  name: string
}

export const LocalEmbedExtension = Node.create({
  name: 'localEmbed',
  group: 'block',
  selectable: false,
  atom: true,
  addAttributes(): Record<keyof LocalEmbedAttribute, Attribute> {
    return {
      name: {
        default: null,
      }
    }
  },
  addCommands() {
    return {
      insertLocalEmbed$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<LocalEmbedAttribute>(this, tr, { name: '' })
      },
    }
  },
  addNodeView() {
    return SolidNodeViewRenderer(() => (
      <LocalEmbedProvider>
        <LocalEmbedNode />
      </LocalEmbedProvider>
    ))
  },
})