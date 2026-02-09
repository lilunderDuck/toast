import type { ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TableItem.module.css"

const style = stylex.create({
  item: {
    display: "flex",
    alignItems: "center",
    height: "100%"
  }
})

export function TableItem(props: ParentProps) {
  return (
    <div {...props} {...stylex.attrs(style.item)} id={__style.item} />
  )
}