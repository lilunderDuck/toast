import { type Attribute, Node } from '@tiptap/core'
// ...
import { SolidNodeViewRenderer } from '~/libs/solid-tiptap-renderer'
// ...
import { insertNodeAtCurrentPosition } from '../../utils'
import GalleryNodeView from './node'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Gallery$: {
      insertGallery$: () => ReturnType
    }
  }
}

export const DEFAULT_GALLERY_ID = 0

export type GalleryAttribute = {
  id: number
  viewMode?: number
}

export const GalleryExtension = Node.create({
  name: 'gallery',
  group: 'block',
  selectable: false,
  atom: true,
  addAttributes(): Record<keyof GalleryAttribute, Attribute> {
    return {
      id: {
        default: DEFAULT_GALLERY_ID
      },
      viewMode: {
        default: null
      }
    }
  },
  addCommands() {
    return {
      insertGallery$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<GalleryAttribute>(this, tr, { id: DEFAULT_GALLERY_ID, viewMode: GalleryViewMode.SINGLE_ITEM })
      },
    }
  },
  addNodeView() {
    return SolidNodeViewRenderer(GalleryNodeView)
  },
})