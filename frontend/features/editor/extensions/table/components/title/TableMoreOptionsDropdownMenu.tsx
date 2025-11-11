import { BsPencilFill, BsTrash2Fill } from "solid-icons/bs"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "~/components"
import { type IDropdownMenu } from "~/hooks"

export interface ITableMoreOptionsDropdownMenuProps extends IDropdownMenu {
  actions$: (action: "edit") => any
}

export default function TableMoreOptionsDropdownMenu(
  props: ITableMoreOptionsDropdownMenuProps
) {
  return (
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => props.actions$("edit")}>
        <BsPencilFill />
        <span>Edit current tab name.</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <BsTrash2Fill />
        <span>Delete current view</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <BsTrash2Fill />
        <span>Delete all</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}