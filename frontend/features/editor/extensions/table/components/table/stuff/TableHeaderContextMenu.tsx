import { BsTrash2Fill } from "solid-icons/bs";
import { Match, Switch } from "solid-js";
import { ContextMenuContent, ContextMenuItem } from "~/components";
import type { IBaseContextMenu } from "~/hooks";

export interface ITableHeaderContextMenuProps extends IBaseContextMenu, IActionHandler<TableHeaderContextMenuAction> {
  type$: TableDataType
}

export default function TableHeaderContextMenu(props: ITableHeaderContextMenuProps) {
  return (
    <ContextMenuContent>
      <Switch>
        <Match when={props.type$ === TableDataType.TAG}>
          <ContextMenuItem onClick={() => props.action$(TableHeaderContextMenuAction.DELETE_COLUMN)}>
            <BsTrash2Fill />
            <span>Delete column</span>
          </ContextMenuItem>
        </Match>
      </Switch>
      <ContextMenuItem onClick={() => props.action$(TableHeaderContextMenuAction.DELETE_COLUMN)}>
        <BsTrash2Fill />
        <span>Delete column</span>
      </ContextMenuItem>
    </ContextMenuContent>
  )
}