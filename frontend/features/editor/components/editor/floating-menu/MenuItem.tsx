import type { IFloatingMenuItem } from "~/features/editor/provider"
// ...
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

interface IMenuItemProps extends IFloatingMenuItem {
  // ...
}

export function MenuItem(props: IMenuItemProps) {
  return (
    <button {...stylex.attrs(style.menu)} onClick={() => props.command$().run()}>
      <props.icon$ />
      {props.name$}
    </button>
  )
}