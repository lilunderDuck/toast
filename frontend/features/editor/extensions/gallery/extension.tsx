import { type Command } from '@tiptap/core'
// ...
import { createEditorNode, insertNodeAtCurrentPosition } from '../../utils'
import GalleryNodeView from './node'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Gallery$: {
      insertGallery$: () => Command
    }
  }
}

export type GalleryAttribute = {
  id: string
  viewMode?: GalleryViewMode
}

export const GalleryExtension = createEditorNode<
  GalleryAttribute, 
  EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: 'gallery',
  attributes$: () => ({
    id: {
      default: GALLERY_DEFAULT_ID
    },
    viewMode: {
      default: null
    }
  }),
  commands$() {
    return {
      insertGallery$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<GalleryAttribute>(this, tr, { 
          id: GALLERY_DEFAULT_ID, 
          viewMode: GalleryViewMode.SINGLE_ITEM 
        })
      },
    }
  },
  View$: GalleryNodeView,
})