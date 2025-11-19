import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  spacer: {
    flex: '1 1 0%',
    placeSelf: 'stretch'
  }
})

export function Spacer(props: HTMLAttributes<"div">) {
  return (
    <div {...props} class={MERGE_CLASS(
      props,
      stylex.attrs(style.spacer)
    )} />
  )
}