import { For } from "solid-js"
import { MERGE_CLASS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TableRoot.module.css"
import "~/styles/scrollbar.css"
// ...
import { EditorEditModeOnly } from "~/features/editor/components"
// ...
import { TableRow, TableHeader } from "./stuff"
import { useTableContext } from "../../provider"
import { TableDataHeader, TableDataItem } from "../table-data-display"
import CreateTableColumnButton from "./CreateTableColumnButton"
import CreateTableRowButton from "./CreateTableRowButton"

const style = stylex.create({
  table: {
    userSelect: "none",
    width: "100%",
  },
  table__outer: {
    width: "100%",
    // hacky way to show the table horizontal scrollbar
    maxWidth: "63.5vw",
    display: "flex"
  },
  table__content: {
    width: "auto",
    // Ensure the table itself doesn't restrict width
    tableLayout: "fixed",
    paddingRight: "3rem",
    flexShrink: 0
  },
  table__head: {
    position: "sticky",
    zIndex: 2,
    top: 0,
  },
  table__headerDraggable: {
    width: 5
  },
  table__draggableRowHandleIndicator: {
    width: 2
  }
})

export function TableRoot() {
  const { columns$, rows$ } = useTableContext()

  return (
    <div {...stylex.attrs(style.table)}>
      <div class={MERGE_CLASS('scrollbar', 'scrollbarHorizontal', stylex.attrs(style.table__outer))}>
        <table {...stylex.attrs(style.table__content)} id={__style.table}>
          <thead>
            <tr>
              <EditorEditModeOnly>
                {/* A single lonely <th /> for draggable handle */}
                <th {...stylex.attrs(style.table__draggableRowHandleIndicator)} />
              </EditorEditModeOnly>
              <For each={columns$.get$()}>
                {(col, colIndex) => (
                  <TableHeader columnIndex$={colIndex()} columnId$={col.key}>
                    <TableDataHeader {...col} />
                  </TableHeader>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={rows$.get$()}>
              {(row, rowIndex) => (
                <TableRow
                  rowData$={row}
                  rowIndex$={rowIndex()}
                  rowItemComponent$={TableDataItem}
                />
              )}
            </For>
          </tbody>
        </table>
        <CreateTableColumnButton />
      </div>
      <CreateTableRowButton />
    </div>
  )
}