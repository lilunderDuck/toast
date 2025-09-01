import stylex from "@stylexjs/stylex"
import { mergeClassname } from "../../utils"

const style = stylex.create({
  spacer: {
    flex: '1 1 0%',
    placeSelf: 'stretch'
  }
})

export function Spacer(props: HTMLAttributes<"div">) {
  return (
    <div {...props} class={mergeClassname(
      props,
      stylex.attrs(style.spacer)
    )} />
  )
}