import { type ValidComponent, splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { ItemLabel, type RadioGroupLabelProps } from "@kobalte/core/radio-group"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { MERGE_CLASS } from "macro-def"

interface IRadioGroupLabelProps<T extends ValidComponent = "label"> extends RadioGroupLabelProps<T> {
  class?: string | undefined
}

const style = stylex.create({
  itemLabel: {
    fontSize: "0.875rem",
    lineHeight: 1,
    fontWeight: 500
  }
})

export function RadioGroupItemLabel<T extends ValidComponent = "label">(
  props: PolymorphicProps<T, IRadioGroupLabelProps<T>>
) {
  const [local, others] = splitProps(props as IRadioGroupLabelProps, ["class"])
  return (
    <ItemLabel
      class={MERGE_CLASS(stylex.attrs(style.itemLabel), local)}
      {...others}
    />
  )
}