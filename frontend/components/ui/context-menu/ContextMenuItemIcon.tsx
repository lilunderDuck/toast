import stylex from "@stylexjs/stylex"
import type { ParentProps } from "solid-js"

const style = stylex.create({
  iconWrap: {
    width: 22,
    height: 22,
    marginRight: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: 'center',
  }
})

export function ContextMenuItemIcon(props: ParentProps) {
  return (
    <div {...stylex.attrs(style.iconWrap)}>
      {props.children}
    </div>
  )
}