import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Root, type RadioGroupRootProps } from "@kobalte/core/radio-group"
// ...
import { css } from "molcss"

const group = css`
  display: grid;
  gap: 0.5rem;
`

interface IRadioGroupRootProps<T extends ValidComponent = "div"> extends RadioGroupRootProps<T> {
  class?: string
}

export function RadioGroup<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IRadioGroupRootProps<T>>
) {
  const [local, others] = splitProps(props as IRadioGroupRootProps, ["class"])
  return (
    <Root class={`${group} ${local.class ?? ""}`} {...others} />
  )
}