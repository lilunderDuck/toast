import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as RadioGroupPrimitive from "@kobalte/core/radio-group"
// ...
import { mergeClassname } from "~/utils"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  group: {
    display: 'grid',
    gap: '0.5rem'
  }
})
 
type RadioGroupRootProps<T extends ValidComponent = "div"> =
  RadioGroupPrimitive.RadioGroupRootProps<T> & { class?: string | undefined }
// ...

export function RadioGroup<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupRootProps<T>>
) {
  const [local, others] = splitProps(props as RadioGroupRootProps, ["class"])
  return <RadioGroupPrimitive.Root class={mergeClassname(
    stylex.attrs(style.group), 
    local.class
  )} {...others} />
}