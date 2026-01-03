import type { ParentProps } from "solid-js"
// ...
import { reorderArray } from "~/utils"
import { createLazyLoadedContextMenu } from "~/hooks"
import { Tooltip } from "~/components"
import { EditorEditModeWrapper } from "~/features/editor/components"
// ...
import { useTableContext } from "../../../provider"
import { TableItem } from "./TableItem"
import type { ITableHeaderContextMenuProps } from "./TableHeaderContextMenu"

interface ITableHeaderProps {
  columnIndex$: number
  columnId$: string
}

export function TableHeader(props: ParentProps<ITableHeaderProps>) {
  const { draggedColumnIndex$, columns$, resizingColumnIndex$, /*columnWidths$,*/ deleteColumn$ } = useTableContext()

  const handleColDragStart = (e: EventType<"th", "onDragStart">, index: number) => {
    resizingColumnIndex$.set$(index)
    e.dataTransfer!.setData('text/plain', `${index}`)
    // setTimeout(() => e.currentTarget.classList.add('opacity-40'), 0)
  }

  const handleColDragOver = (e: EventType<"th", "onDragOver">, targetIndex: number) => {
    e.preventDefault()
    e.dataTransfer!.dropEffect = 'move'
    const draggedIndex = draggedColumnIndex$.get$()
    if (draggedIndex && draggedIndex !== targetIndex) {
      // e.currentTarget.classList.add('border-r-4', 'border-r-blue-300', 'border-opacity-70')
    }
  }

  const handleColDragLeave: EventHandler<"th", "onDragLeave"> = (_e) => {
    // e.currentTarget.classList.remove('border-r-4', 'border-r-blue-300', 'border-opacity-70')
  }

  const handleColDrop = (e: EventType<"th", "onDrop">, toIndex: number) => {
    e.preventDefault()
    // e.currentTarget.classList.remove('border-r-4', 'border-r-blue-300', 'border-opacity-70')
    const fromIndex = parseInt(e.dataTransfer!.getData('text/plain'), 10)

    if (fromIndex !== toIndex) {
      columns$.set$(prevCols => reorderArray(prevCols, fromIndex, toIndex))
    }
  }

  const handleColDragEnd: EventHandler<"th", "onDragEnd"> = (_e) => {
    draggedColumnIndex$.set$(undefined)
    // e.currentTarget.classList.remove('opacity-40')
    // Clean up any remaining drop highlights
    // document.querySelectorAll('th').forEach(th => th.classList.remove('border-r-4', 'border-r-blue-300', 'border-opacity-70'))
  }

  const TableHeaderContextMenu = createLazyLoadedContextMenu(
    () => import("./TableHeaderContextMenu"),
    () => ({
      action$(type) {
        switch (type) {
          case TableHeaderContextMenuAction.DELETE_COLUMN:
            deleteColumn$(props.columnId$)
            break;

          default:
            break;
        }
      },
    }) as ITableHeaderContextMenuProps
  )

  return (
    <th
      scope="col"
      draggable="true"
      onDragStart={(e) => handleColDragStart(e, props.columnIndex$)}
      onDragOver={(e) => handleColDragOver(e, props.columnIndex$)}
      onDrop={(e) => handleColDrop(e, props.columnIndex$)}
      onDragEnd={handleColDragEnd}
      onDragLeave={handleColDragLeave}
      // style={{ width: columnWidths$.get$()[props.columnIndex$] + 'px' }}
    >
      <EditorEditModeWrapper root$={(props) => (
        <Tooltip label$="Right click for more options">
          <TableHeaderContextMenu.ContextMenu$>
            {props.children}
          </TableHeaderContextMenu.ContextMenu$>
        </Tooltip>
      )}>
        <TableItem>
          {props.children}
        </TableItem>
      </EditorEditModeWrapper>
    </th>
  )
}