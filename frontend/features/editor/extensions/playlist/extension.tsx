import { type Command } from '@tiptap/core'
// ...
import { createEditorNode, insertNodeAtCurrentPosition } from '../../utils'
import PlaylistNode from './node'
import { PlaylistProvider } from './provider'
// import { LocalEmbedProvider } from './provider'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    playlist$: {
      insertPlaylist$: () => Command
    }
  }
}

export type PlaylistAttribute = {
  id: number
}

export const PlaylistExtension = createEditorNode<
  PlaylistAttribute, 
  EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: "playlist",
  commands$() {
    return {
      insertPlaylist$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<PlaylistAttribute>(this, tr, { id: -1 })
      },
    }
  },
  attributes$: () => ({
    id: {
      default: null
    }
  }),
  
  View$: () => (
    <PlaylistProvider>
      <PlaylistNode />
    </PlaylistProvider>
  )
})