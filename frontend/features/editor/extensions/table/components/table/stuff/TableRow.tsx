import { For, Show, type Accessor, type VoidComponent } from "solid-js"
// ...
import { reorderArray } from "~/utils"
import { useEditorContext } from "~/features/editor/provider"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { useTableContext, type ColumnData, type TableDefaultValueMapping } from "../../../provider"

export type RowItemComponentProps<T extends TableDataType = TableDataType> = {
  index$: Accessor<number>
  value$: TableDefaultValueMapping<T>
} & ColumnData

interface ITableRowProps {
  rowData$: AnyObject
  rowIndex$: number
  rowItemComponent$: VoidComponent<RowItemComponentProps>
}

const style = stylex.create({
  row: {
    position: "relative"
  },
  row__draggableHandle: {
    backgroundColor: "var(--gray10)",
    width: 10
  }
})

export function TableRow(props: ITableRowProps) {
  const { isReadonly$ } = useEditorContext()
  const { draggedRowIndex$, rows$, columns$ } = useTableContext()

  const handleRowDragStart = (e: EventType<"tr", "onDragStart">, index: number) => {
    draggedRowIndex$.set$(index)
    e.dataTransfer!.setData('text/plain', `${index}`)
    // setTimeout(() => e.currentTarget.classList.add('opacity-40'), 0) // Hide dragged item
  }

  const handleRowDragOver = (e: EventType<"tr", "onDragOver">, targetIndex: number) => {
    e.preventDefault()
    const draggedIndex = draggedRowIndex$.get$()
    if (draggedIndex && draggedIndex !== targetIndex) {
      // e.currentTarget.classList.add('border-b-4', 'border-blue-500', 'border-opacity-70')
    }
  }

  const handleRowDragLeave = (e: EventType<"tr", "onDragLeave">) => {
    // e.currentTarget.classList.remove('border-b-4', 'border-blue-500', 'border-opacity-70')
  }

  const handleRowDrop = (e: EventType<"tr", "onDrop">, toIndex: number) => {
    e.preventDefault()
    // e.currentTarget.classList.remove('border-b-4', 'border-blue-500', 'border-opacity-70')
    const fromIndex = parseInt(e.dataTransfer!.getData('text/plain'), 10)

    if (fromIndex !== toIndex) {
      rows$.set$(prevRows => reorderArray(prevRows, fromIndex, toIndex))
    }
  }

  const handleRowDragEnd = (e: EventType<"tr", "onDragEnd">) => {
    draggedRowIndex$.set$(undefined)
    e.currentTarget.classList.remove('opacity-40')
    // Clean up any remaining drop highlights
    // document.querySelectorAll('tr').forEach(tr => tr.classList.remove('border-b-4', 'border-blue-500', 'border-opacity-70'))
  }

  return (
    <tr {...stylex.attrs(style.row)}>
      <Show when={!isReadonly$()}>
        <td
          {...stylex.attrs(style.row__draggableHandle)}
          draggable="true"
          onDragStart={(e) => handleRowDragStart(e, props.rowIndex$)}
          onDragOver={(e) => handleRowDragOver(e, props.rowIndex$)}
          onDrop={(e) => handleRowDrop(e, props.rowIndex$)}
          onDragEnd={handleRowDragEnd}
          onDragLeave={handleRowDragLeave}
        />
      </Show>
      <For each={columns$.get$()}>
        {(it /*, index*/) => (
          <td>
            <props.rowItemComponent$
              {...it}
              // Yeah that took quite a while to find this bug, here is it
              // index$={index}
              // If we leave like that, funky stuff happens like
              // - Rows override other rows data
              // - Only some part of the table is saved 
              index$={() => props.rowIndex$}
              value$={props.rowData$[it.key]}
            />
          </td>
        )}
      </For>
      <Show when={!isReadonly$()}>
        <td />
      </Show>
    </tr>
  )
} 