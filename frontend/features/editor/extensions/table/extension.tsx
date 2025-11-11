import { lazy } from 'solid-js'
import { type Attribute, Node } from '@tiptap/core'
// ...
import { SolidNodeViewRenderer } from '~/libs/solid-tiptap-renderer'
import { makeId } from '~/utils'
// ...
import { insertNodeAtCurrentPosition } from '../../utils'
import type { TableAttribute } from './provider'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    table: {
      insertTable$: () => ReturnType
    }
  }
}

const TableNodeView = lazy(() => import("./node"))

export const TableExtension = Node.create({
  name: 'table',
  group: 'block',
  inline: false,
  selectable: false,
  atom: true,
  addAttributes(): Record<keyof TableAttribute, Attribute> {
    return {
      id: {
        default: ''
      },
    }
  },
  addCommands() {
    return {
      insertTable$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<TableAttribute>(this, tr, { 
          id: '',
        })
      },
    }
  },
  addNodeView: () => SolidNodeViewRenderer(TableNodeView),
})