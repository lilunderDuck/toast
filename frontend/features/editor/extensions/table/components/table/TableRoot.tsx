import { For, Show, type ParentProps } from "solid-js"
import { MERGE_CLASS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TableRoot.module.css"
import "~/styles/scrollbar.css"
// ...
import { useEditorContext } from "~/features/editor/provider"
// ...
import { TableRow, TableHeader } from "./stuff"
import { useTableContext } from "../../provider"
import { TableDataHeader, TableDataItem } from "../table-data-display"
import { TableCreateColumnButton } from "./stuff"

const style = stylex.create({
  table: {
    userSelect: "none",
    width: "100%",
  },
  table__outer: {
    width: "100%",
    // hacky way to show the table horizontal scrollbar
    maxWidth: "calc(100% - 2.375rem)",
  },
  table__content: {
    width: "auto",
    // Ensure the table itself doesn't restrict width
    tableLayout: "fixed",
    paddingRight: "3rem"
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

export function TableRoot(props: ParentProps) {
  const { isReadonly$ } = useEditorContext()
  const { columns$, rows$ } = useTableContext()

  return (
    <div {...stylex.attrs(style.table)}>
      <div class={MERGE_CLASS('scrollbar', 'scrollbarHorizontal', stylex.attrs(style.table__outer))}>
        <table {...stylex.attrs(style.table__content)} id={__style.table}>
          <thead>
            <tr>
              <Show when={!isReadonly$()}>
                {/* A single lonely <th /> for draggable handle */}
                <th {...stylex.attrs(style.table__draggableRowHandleIndicator)} />
              </Show>
              <For each={columns$.get$()}>
                {(col, colIndex) => (
                  <TableHeader columnIndex$={colIndex()}>
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
      </div>
      {void console.log(rows$.get$())}
      {props.children}
    </div>
  )
}