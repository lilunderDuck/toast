import { BsKanbanFill, BsPlusLg, BsTabletFill, BsThreeDots } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TableTabList.module.css"
// ...
import { createLazyLoadedDialog, createLazyLoadedDropdownMenu } from "~/hooks"
import { Button, Spacer, Tooltip } from "~/components"
// ...
import type { ITableMoreOptionsDropdownMenuProps } from "./TableMoreOptionsDropdownMenu"
import { useTablesDataContext } from "../../provider"

const style = stylex.create({
  tab: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 5
  },
  tab__item: {
    display: "flex",
    alignItems: "center",
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: 6,
    gap: 10,
  }
})

const TAB_VIEW_MAPPING = {
  [TableViewType.TABLE]: {
    icon$: BsTabletFill,
    defaultName$: "Table view"
  },
  [TableViewType.KANBAN]: {
    icon$: BsKanbanFill,
    defaultName$: "Kanban view"
  }
}

export function TableTabList() {
  const { tabs$, event$ } = useTablesDataContext()

  const TableCreateColumnDialog = createLazyLoadedDialog(
    () => import("./dialog/TableCreateColumnDialog"),
    () => ({
      onSubmit$(schema) {
        event$.emit$("insertColumn", schema.name, schema.type)
      },
    })
  )

  const TableMoreOptionsDropdownMenu = createLazyLoadedDropdownMenu(
    () => import("./TableMoreOptionsDropdownMenu"),
    () => ({
      actions$(action) {
        switch (action) {
          case "edit":
            EditTableTabDialog.show$()
            break
          case "insert_column":
            TableCreateColumnDialog.show$()
            break
          case "insert_row":
            event$.emit$("insertRow")
            break
        }
      },
    }) as ITableMoreOptionsDropdownMenuProps
  )

  const EditTableTabDialog = createLazyLoadedDialog(
    () => import("./EditTableTabDialog"),
    () => ({
      oldTitle$: tabs$.getCurrentFocused$().name,
      onSubmit$(data) {
        const currentTab = tabs$.getCurrentFocused$()
        tabs$.update$(currentTab.id, {
          name: data.newTitle$
        })
      },
    })
  )

  return (
    <div {...stylex.attrs(style.tab)} id={__style.tabs}>
      <tabs$.TabList$ tabComponent$={(props) => {
        const view = TAB_VIEW_MAPPING[props.type]
        return (
          <div
            {...stylex.attrs(style.tab__item)}
            id={__style.tabItem}
          >
            <view.icon$ />
            {props.name ?? view.defaultName$}
          </div>
        )
      }} />
      <Spacer />
      <Tooltip label$="New table tab">
        <Button
          size$={ButtonSize.ICON}
          variant$={ButtonVariant.NO_BACKGROUND}
        >
          <BsPlusLg />
        </Button>
      </Tooltip>
      <Tooltip label$="More options">
        <TableMoreOptionsDropdownMenu.DropdownMenu$>
          <Button
            size$={ButtonSize.ICON}
            variant$={ButtonVariant.NO_BACKGROUND}
          >
            <BsThreeDots />
          </Button>
        </TableMoreOptionsDropdownMenu.DropdownMenu$>
      </Tooltip>

      <EditTableTabDialog.Dialog$ />
      <TableCreateColumnDialog.Dialog$ />
    </div>
  )
}