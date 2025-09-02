import { macro_mergeClassnames } from "macro-def"
import __style from "./AppTitleBar.module.css"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  titleBar: {
    height: "var(--title-bar-thiccness)",
    width: "100%",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    zIndex: 9
  }
})

export function AppTitleBarDraggable(props: HTMLAttributes<"div">) {
  return (
    <div {...props} class={macro_mergeClassnames(props.class, stylex.attrs(style.titleBar))} style="--wails-draggable: drag" id={__style.buttonRow} />
  )
}