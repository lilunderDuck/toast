import stylex from "@stylexjs/stylex"
import { CLS } from "macro-def"
import { splitProps } from "solid-js"

const style = stylex.create({
  menuShortcut: {
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    opacity: 0.6
  },
})

export function DropdownMenuShortcut(props: HTMLAttributes<"span">) {
  const [, rest] = splitProps(props, ["class"])
  return <span class={`${CLS(style.menuShortcut)} ${props.class ?? ""}`} {...rest} />
}