import { type Command } from '@tiptap/core'
// ...
import { createEditorNode, insertNodeAtCurrentPosition } from '../../utils'
import GalleryNodeView from './node'
import type { EditorGenericIdAttribute } from '../../provider'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Gallery$: {
      insertGallery$: () => Command
    }
  }
}


export type GalleryAttribute = {
  viewMode?: GalleryViewMode
} & EditorGenericIdAttribute

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