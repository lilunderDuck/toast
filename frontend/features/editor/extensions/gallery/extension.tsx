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

export const DEFAULT_GALLERY_ID = 0

export type GalleryAttribute = {
  id: number
  viewMode?: number
}

export const GalleryExtension = createEditorNode<
  GalleryAttribute, 
  EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: 'gallery',
  attributes$: () => ({
    id: {
      default: DEFAULT_GALLERY_ID
    },
    viewMode: {
      default: null
    }
  }),
  commands$() {
    return {
      insertGallery$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<GalleryAttribute>(this, tr, { id: DEFAULT_GALLERY_ID, viewMode: GalleryViewMode.SINGLE_ITEM })
      },
    }
  },
  View$: GalleryNodeView,
  menu$(editorInstance) {
    return {}
  },
})