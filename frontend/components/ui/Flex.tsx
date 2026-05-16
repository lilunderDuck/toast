import stylex from "@stylexjs/stylex"
import { CLS } from "macro-def"

const style = stylex.create({
  spacer: {
    flex: '1 1 0%',
    placeSelf: 'stretch'
  }
})

export function Spacer(props: HTMLAttributes<"div">) {
  return (
    <div {...props} class={`${CLS(style.spacer)} ${props.class ?? ""}`} />
  )
}