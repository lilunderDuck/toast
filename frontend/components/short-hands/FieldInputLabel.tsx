import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  label: {
    fontSize: 13.5, // sub-pixel perfect 👍
    fontWeight: "bold",
    userSelect: "none"
  }
})

export function FieldInputLabel(props: HTMLAttributes<"label">) {
  return <label {...props} class={MERGE_CLASS(props, stylex.attrs(style.label))} />
}