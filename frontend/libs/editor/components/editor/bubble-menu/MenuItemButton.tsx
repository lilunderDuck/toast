import { MERGE_CLASS } from "macro-def"
import type { IconTypes } from "solid-icons"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./MenuItemButton.module.css"
// ...
import { Tooltip } from "~/components"

const style = stylex.create({
  item: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "var(--gray11)",
    width: "1.575rem",
    height: "1.575rem",
    ":hover": {
      backgroundColor: "var(--gray5)",
      color: "var(--gray12)",
    }
  },
  item__active: {
    backgroundColor: "var(--gray5)",
    color: "var(--gray12)"
  },
  item__name: {
    fontSize: 15
  }
})

interface IMenuItemButtonProps {
  onClick$: EventHandler<"button", "onClick">
  icon$: IconTypes
  name$?: string
  isActive$: boolean
}

export default function MenuItemButton(props: IMenuItemButtonProps) {
  return (
    <Tooltip label$={props.name$}>
      <button 
        onClick={props.onClick$}
        class={MERGE_CLASS(
          stylex.attrs(style.item),
          __style.itemButton,
          props.isActive$ ? __style.active : ''
        )} 
        {...stylex.attrs(style.item)} 
        tabindex={1}
        data-bubble-menu-item
        data-bubble-menu-item-button
      >
        <props.icon$ />
      </button>
    </Tooltip>
  )
}