import { lazy } from 'solid-js'
// ...
import { createEditorNode, insertNodeAtCurrentPosition } from '../../utils'
import type { TableAttribute } from './provider'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    table: {
      insertTable$: () => ReturnType
    }
  }
}

const TableNodeView = lazy(() => import("./node"))

export const TableExtension = createEditorNode<
  TableAttribute,
  EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: "table",
  commands$() {
    return {
      insertTable$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<TableAttribute>(this, tr, {
          id: '' // let TablesDataProvider initialize instead
        })
      }
    }
  },
  attributes$: () => ({
    id: {
      default: TABLE_DEFAULT_ID
    }
  }),
  View$: TableNodeView
})