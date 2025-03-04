import { Button, ButtonSizeVariant, type ButtonProps } from "../ui"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  button: {
    padding: 0
  }
})

export function TitlebarButton(props: HTMLAttributes<"button">) {
  return (
    <Button size$={ButtonSizeVariant.icon} {...props} {...stylex.attrs(style.button)} />
  )
}
