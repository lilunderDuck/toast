import stylex from "@stylexjs/stylex"
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  spacer: {
    flex: '1 1 0%',
    placeSelf: 'stretch'
  }
})

export function Spacer(props: HTMLAttributes<"div">) {
  return (
    <div {...props} class={macro_mergeClassnames(
      props,
      stylex.attrs(style.spacer)
    )} />
  )
}