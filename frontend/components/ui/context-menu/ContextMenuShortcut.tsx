import stylex from "@stylexjs/stylex"
import { splitProps } from "solid-js"
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  menuShortcut: {
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    opacity: 0.6
  },
})

export function ContextMenuShortcut(props: HTMLAttributes<"span">) {
  const [, rest] = splitProps(props, ["class"])
  return <span class={macro_mergeClassnames(props, stylex.attrs(style.menuShortcut))} {...rest} />
}