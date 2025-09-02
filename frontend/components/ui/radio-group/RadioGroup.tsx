import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Root, type RadioGroupRootProps } from "@kobalte/core/radio-group"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  group: {
    display: 'grid',
    gap: '0.5rem'
  }
})

interface IRadioGroupRootProps<T extends ValidComponent = "div"> extends RadioGroupRootProps<T> {
  class?: string
}

export function RadioGroup<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IRadioGroupRootProps<T>>
) {
  const [local, others] = splitProps(props as IRadioGroupRootProps, ["class"])
  return (
    <Root class={macro_mergeClassnames(
      stylex.attrs(style.group),
      local
    )} {...others} />
  )
}