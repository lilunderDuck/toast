import { type Attribute, Node } from '@tiptap/core'
// ...
import { SolidNodeViewRenderer } from '../../components'
import { insertNodeAtCurrentPosition } from '../../utils'
import GalleryNodeView from './node'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Gallery$: {
      insertGallery$: () => ReturnType
    }
  }
}

export type GalleryAttribute = {
  id: number
}

export const GalleryExtension = Node.create({
  name: 'gallery',
  group: 'block',
  selectable: false,
  atom: true,
  addAttributes(): Record<keyof GalleryAttribute, Attribute> {
    return {
      id: {
        default: 0
      }
    }
  },
  addCommands() {
    return {
      insertGallery$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<GalleryAttribute>(this, tr, { id: 0 })
      },
    }
  },
  addNodeView() {
    return SolidNodeViewRenderer(GalleryNodeView)
  },
})