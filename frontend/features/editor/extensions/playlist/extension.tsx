import { type Command } from '@tiptap/core'
// ...
import { createEditorNode, insertNodeAtCurrentPosition } from '../../utils'
import PlaylistNode from './node'
import { PlaylistProvider } from './provider'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    playlist$: {
      insertPlaylist$: () => Command
    }
  }
}

export type PlaylistAttribute = {
  id: string
}

export const PlaylistExtension = createEditorNode<
  PlaylistAttribute, 
  EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: "playlist",
  commands$() {
    return {
      insertPlaylist$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<PlaylistAttribute>(this, tr, { id: PLAYLIST_DEFAULT_ID })
      },
    }
  },
  attributes$: () => ({
    id: {
      default: PLAYLIST_DEFAULT_ID
    }
  }),
  
  View$: () => (
    <PlaylistProvider>
      <PlaylistNode />
    </PlaylistProvider>
  )
})