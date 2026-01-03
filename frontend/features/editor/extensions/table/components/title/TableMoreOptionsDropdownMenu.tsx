import { BsPencilFill, BsTrash2Fill } from "solid-icons/bs"
// ...
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "~/components"
import { type IBaseDropdownMenu } from "~/hooks"

export interface ITableMoreOptionsDropdownMenuProps extends IBaseDropdownMenu, IActionHandler<TableMoreOptionsDropdownAction> {
  totalTabs$: number
}

export default function TableMoreOptionsDropdownMenu(
  props: ITableMoreOptionsDropdownMenuProps
) {
  return (
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => props.action$(TableMoreOptionsDropdownAction.EDIT_CURRENT_TAB)}>
        <BsPencilFill />
        <span>Edit current tab name</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />
      <DropdownMenuItem 
        onClick={() => props.action$(TableMoreOptionsDropdownAction.DELETE_CURRENT_TAB)}
        disabled={props.totalTabs$ == 1}
      >
        <BsTrash2Fill />
        <span>Delete current view</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => props.action$(TableMoreOptionsDropdownAction.DELETE_ALL)}>
        <BsTrash2Fill />
        <span>Delete all</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}