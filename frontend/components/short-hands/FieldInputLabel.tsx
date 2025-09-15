import stylex from "@stylexjs/stylex"
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  label: {
    fontSize: 13.5, // sub-pixel perfect 👍
    fontWeight: "bold",
    userSelect: "none"
  }
})

export function FieldInputLabel(props: HTMLAttributes<"label">) {
  return <label {...props} class={macro_mergeClassnames(props, stylex.attrs(style.label))} />
}