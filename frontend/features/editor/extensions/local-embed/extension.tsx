import { type Command } from '@tiptap/core'
// ...
import { createEditorNode, insertNodeAtCurrentPosition } from '../../utils'
import LocalEmbedNode from './node'
import { LocalEmbedProvider } from './provider'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    localEmbed$: {
      insertLocalEmbed$: () => Command
    }
  }
}

export type LocalEmbedAttribute = {
  name: string
}

export const LocalEmbedExtension = createEditorNode<
  LocalEmbedAttribute,
  EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: "localEmbed",
  commands$() {
    return {
      insertLocalEmbed$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<LocalEmbedAttribute>(this, tr, { id: -1 })
      },
    }
  },
  attributes$: () => ({
    name: {
      default: null
    }
  }),
  
  View$: () => (
    <LocalEmbedProvider>
      <LocalEmbedNode />
    </LocalEmbedProvider>
  )
})