import stylex from "@stylexjs/stylex"
import { CLS } from "macro-def"

const style = stylex.create({
  label: {
    fontSize: 13.5, // sub-pixel perfect 👍
    fontWeight: "bold",
    userSelect: "none"
  }
})

export function Label(props: HTMLAttributes<"label">) {
  return <label {...props} class={`${CLS(style.label)} ${props.class ?? ""}`} />
}