import { For, Show, type ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TableRoot.module.css"
// ...
import { TableRow, TableHeader } from "./stuff"
import { useTableContext } from "../../provider"
import { TableDataHeader, TableDataItem } from "../table-data-display"
import { TableCreateColumnButton } from "./stuff"
import { useEditorContext } from "~/features/editor/provider"

const style = stylex.create({
  table: {
    userSelect: "none",
    width: "100%"
  },
  table__outer: {
    overflowX: "auto",
  },
  table__content: {
    width: "auto"
    // Ensure the table itself doesn't restrict width
    // tableLayout: "fixed"
    // how the fuck can I make the table scrollable
  },
  table__head: {
    position: "sticky",
    zIndex: 2,
    top: 0,
  },
  table__headerDraggable: {
    width: 5
  }
})

export function TableRoot(props: ParentProps) {
  const { isReadonly$ } = useEditorContext()
  const { columns$, rows$ } = useTableContext()

  return (
    <div {...stylex.attrs(style.table)}>
      <div {...stylex.attrs(style.table__outer)}>
        <table {...stylex.attrs(style.table__content)} id={__style.table}>
          <thead>
            <tr>
              <Show when={!isReadonly$()}>
                {/* A single lonely <th /> for draggable handle */}
                <th data-table-draggable-handle-indicator />
              </Show>
              <For each={columns$.get$()}>
                {(col, colIndex) => (
                  <TableHeader columnIndex$={colIndex()}>
                    <TableDataHeader {...col} />
                  </TableHeader>
                )}
              </For>
              <Show when={!isReadonly$()}>
                {/* Another for creating row */}
                <th>
                  <TableCreateColumnButton />
                </th>
              </Show>
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
      </div>
      {void console.log(rows$.get$())}
      {props.children}
    </div>
  )
}