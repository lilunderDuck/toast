import stylex from '@stylexjs/stylex'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

const style = stylex.create({
  table: {
    borderCollapse: 'collapse',
    margin: 0,
    overflow: 'hidden',
    tableLayout: 'fixed',
    width: '100%',
  },
  tableHeader: {
    border: '1px solid var(--gray5)',
    minWidth: '1em',
    padding: '6px 8px',
    position: 'relative',
    verticalAlign: 'top',
    backgroundColor: 'var(--gray3)',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  tableCell: {
    border: '1px solid var(--gray4)',
    padding: '6px 8px',
  }
})

/**A list of extension related to table, comes with already styled table and such.
 * @see https://tiptap.dev/docs/editor/extensions/nodes/table
 */
export const TableRelated = [
  Table.configure({
    resizable: true,
    HTMLAttributes: stylex.attrs(style.table)
  }),
  TableRow,
  TableHeader.configure({
    HTMLAttributes: stylex.attrs(style.tableHeader)
  }),
  TableCell.configure({
    HTMLAttributes: stylex.attrs(style.tableCell)
  })
]