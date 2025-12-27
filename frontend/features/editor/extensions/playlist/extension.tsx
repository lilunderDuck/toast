import { type Command } from '@tiptap/core'
import { lazy } from 'solid-js'
// ...
import { createEditorNode, insertNodeAtCurrentPosition } from '../../utils'
import { PlaylistProvider } from './provider'
import type { EditorGenericIdAttribute } from '../../provider'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    playlist$: {
      insertPlaylist$: () => Command
    }
  }
}

const PlaylistNodeView = lazy(() => import('./node'))

export type PlaylistAttribute = EditorGenericIdAttribute

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
      <PlaylistNodeView />
    </PlaylistProvider>
  )
})