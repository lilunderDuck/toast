import stylex from "@stylexjs/stylex"
import { FlexCenter } from "../Flex"
import type { ParentProps } from "solid-js"

const style = stylex.create({
  iconWrap: {
    width: 22,
    height: 22,
    marginRight: 5
  }
})

export function ContextMenuItemIcon(props: ParentProps) {
  return (
    <FlexCenter {...stylex.attrs(style.iconWrap)}>
      {props.children}
    </FlexCenter>
  )
}