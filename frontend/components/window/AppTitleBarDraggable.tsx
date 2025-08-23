import { mergeClassname } from "~/utils"
import __style from "./AppTitleBar.module.css"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  titleBar: {
    height: 35,
    width: "100%",
    userSelect: "none",
    display: "flex",
    alignItems: "center"
  }
})

export function AppTitleBarDraggable(props: HTMLAttributes<"div">) {
  return (
    <div {...props} class={mergeClassname(props, stylex.attrs(style.titleBar))} style="--wails-draggable: drag" id={__style.buttonRow} />
  )
}