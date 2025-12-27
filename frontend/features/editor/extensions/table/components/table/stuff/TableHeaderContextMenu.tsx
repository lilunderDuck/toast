import { BsTrash2Fill } from "solid-icons/bs";
import { ContextMenuContent, ContextMenuItem } from "~/components";
import type { IContextMenu } from "~/hooks";

export interface ITableHeaderContextMenuProps extends IContextMenu {
  // define your component props here
  action$(type: "delete_column"): void
}

export default function TableHeaderContextMenu(props: ITableHeaderContextMenuProps) {
  return (
    <ContextMenuContent class="w-48">
      <ContextMenuItem onClick={() => props.action$('delete_column')}>
        <BsTrash2Fill />
        <span>Delete column</span>
      </ContextMenuItem>
    </ContextMenuContent>
  )
}