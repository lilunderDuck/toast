import { type Attribute, Node, type Command } from '@tiptap/core'
// ...
import { SolidNodeViewRenderer } from '~/libs/solid-tiptap-renderer'
// ...
import { insertNodeAtCurrentPosition } from '../../utils'
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

export const PlaylistExtension = Node.create({
  name: 'playlist',
  group: 'block',
  selectable: false,
  atom: true,
  addAttributes(): Record<keyof PlaylistAttribute, Attribute> {
    return {
      id: {
        default: null,
      }
    }
  },
  addCommands() {
    return {
      insertPlaylist$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<PlaylistAttribute>(this, tr, { id: -1 })
      },
    }
  },
  addNodeView() {
    return SolidNodeViewRenderer(() => (
      <PlaylistProvider>
        <PlaylistNode />
      </PlaylistProvider>
    ))
  },
})