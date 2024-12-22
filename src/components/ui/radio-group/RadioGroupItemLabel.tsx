import type { JSX, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as RadioGroupPrimitive from "@kobalte/core/radio-group"
import stylex from "@stylexjs/stylex"
import { mergeClassname } from "~/utils"
// ...

type RadioGroupLabelProps<T extends ValidComponent = "label"> =
  RadioGroupPrimitive.RadioGroupLabelProps<T> & {
    class?: string | undefined
  }
// ...

const style = stylex.create({
  itemLabel: {"fontSize":"0.875rem","lineHeight":1,"fontWeight":500}
})

export function RadioGroupItemLabel<T extends ValidComponent = "label">(
  props: PolymorphicProps<T, RadioGroupLabelProps<T>>
) {
  const [local, others] = splitProps(props as RadioGroupLabelProps, ["class"])
  return (
    <RadioGroupPrimitive.ItemLabel
      class={mergeClassname(
        stylex.attrs(style.itemLabel),
        local.class
      )}
      {...others}
    />
  )
}