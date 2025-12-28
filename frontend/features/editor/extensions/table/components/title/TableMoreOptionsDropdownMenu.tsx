import { BsPencilFill, BsTrash2Fill } from "solid-icons/bs"
import { AiOutlineInsertRowBelow, AiOutlineInsertRowRight } from "solid-icons/ai"
// ...
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "~/components"
import { type IDropdownMenu } from "~/hooks"

export interface ITableMoreOptionsDropdownMenuProps extends IDropdownMenu {
  actions$: (action: TableMoreOptionsDropdownAction) => any
  totalTabs$: number
}

export default function TableMoreOptionsDropdownMenu(
  props: ITableMoreOptionsDropdownMenuProps
) {
  return (
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => props.actions$(TableMoreOptionsDropdownAction.INSERT_ROW)}>
        <AiOutlineInsertRowBelow />
        <span>Insert row</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => props.actions$(TableMoreOptionsDropdownAction.INSERT_COLUMN)}>
        <AiOutlineInsertRowRight />
        <span>Insert column</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => props.actions$(TableMoreOptionsDropdownAction.INSERT_ROW)}>
        <BsPencilFill />
        <span>Edit current tab name</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />
      <DropdownMenuItem 
        onClick={() => props.actions$(TableMoreOptionsDropdownAction.DELETE_CURRENT_TAB)}
        disabled={props.totalTabs$ == 1}
      >
        <BsTrash2Fill />
        <span>Delete current view</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => props.actions$(TableMoreOptionsDropdownAction.DELETE_ALL)}>
        <BsTrash2Fill />
        <span>Delete all</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}