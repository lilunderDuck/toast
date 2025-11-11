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
      id: {},
      grid: {},
      tabs: {},
      title: {}
    }
  },
  addCommands() {
    return {
      insertTable$: () => ({ tr }) => {
        const TABLE_ID = makeId(5)
        const TABLE_GRID_ID = makeId(5)
        const TABLE_COLUMN_ID = makeId(5)
        return insertNodeAtCurrentPosition<TableAttribute>(this, tr, { 
          id: TABLE_ID,
          grid: {
            [TABLE_GRID_ID]: {
              columns: [
                { key: TABLE_COLUMN_ID, label: "Column", type: TableDataType.TEXT }
              ],
              rows: [
                { [TABLE_COLUMN_ID]: '' }
              ]
            }
          },
          tabs: [
            { name: "Table view", type: TableViewType.TABLE, id: TABLE_GRID_ID }
          ],
          title: "Untitled"
        })
      },
    }
  },
  addNodeView: () => SolidNodeViewRenderer(TableNodeView),
})