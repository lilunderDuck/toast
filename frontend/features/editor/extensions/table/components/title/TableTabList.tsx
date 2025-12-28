import { BsKanbanFill, BsPlusLg } from "solid-icons/bs"
import { FaSolidTableColumns } from "solid-icons/fa"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TableTabList.module.css"
// ...
import { Button, Spacer, Tooltip } from "~/components"
// ...
import { useTablesDataContext } from "../../provider"
import { TableMoreOptionsButton } from "./TableMoreOptionsButton"

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
    icon$: FaSolidTableColumns,
    defaultName$: "Table view"
  },
  [TableViewType.KANBAN]: {
    icon$: BsKanbanFill,
    defaultName$: "Kanban view"
  }
}

export function TableTabList() {
  const { tabs$, createTableTab$ } = useTablesDataContext()

  return (
    <div {...stylex.attrs(style.tab)} id={__style.tabs}>
      <tabs$.TabList$ tabComponent$={(props) => {
        const view = TAB_VIEW_MAPPING[props.type as TableViewType]
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
          onClick={createTableTab$}
        >
          <BsPlusLg />
        </Button>
      </Tooltip>
      <Tooltip label$="More options">
        <TableMoreOptionsButton />
      </Tooltip>
    </div>
  )
}