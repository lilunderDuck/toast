import type { ISlashCommandMenuItem } from "./Menu"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menu: {
    outline: "none",
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingInline: 12,
    paddingBlock: 6,
    width: "100%",
    color: "var(--gray11)",
    ":hover": {
      color: "var(--gray12)",
      backgroundColor: "var(--gray4)"
    }
  }
})

interface IMenuItemProps extends ISlashCommandMenuItem {
  // ...
}

export function MenuItem(props: IMenuItemProps) {
  return (
    <button {...stylex.attrs(style.menu)}>
      <props.icon$ />
      {props.name$}
    </button>
  )
}