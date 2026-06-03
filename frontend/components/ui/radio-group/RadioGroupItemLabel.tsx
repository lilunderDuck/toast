import { type ValidComponent, splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { ItemLabel, type RadioGroupLabelProps } from "@kobalte/core/radio-group"
// ...
import { css } from "molcss"

interface IRadioGroupLabelProps<T extends ValidComponent = "label"> extends RadioGroupLabelProps<T> {
  class?: string | undefined
}

const itemLabel = css`
  font-size: 0.875rem;
  line-height: 1;
  font-weight: 500;
`

export function RadioGroupItemLabel<T extends ValidComponent = "label">(
  props: PolymorphicProps<T, IRadioGroupLabelProps<T>>
) {
  const [local, others] = splitProps(props as IRadioGroupLabelProps, ["class"])
  return (
    <ItemLabel
      class={`${itemLabel} ${local.class}`}
      {...others}
    />
  )
}