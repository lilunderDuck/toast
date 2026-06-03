import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { type SelectTriggerProps, Trigger } from "@kobalte/core/select"
import { type JSX, splitProps, type ValidComponent } from "solid-js"
// ...
import { css } from "molcss"

const trigger = css`
  display: flex;
  padding-block: 5px;
  padding-inline: 0.75rem;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.375rem;
  width: 100%;
  font-size: 0.875rem;
  background-color: transparent;
`

interface ISelectTriggerProps<T extends ValidComponent = "button"> extends SelectTriggerProps<T> {
  class?: string | undefined
  children?: JSX.Element
}

export function SelectTrigger<T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ISelectTriggerProps<T>>,
) {
  const [local, others] = splitProps(props as ISelectTriggerProps<T>, [
    "class",
    "children",
  ])

  return (
    // @ts-ignore
    <Trigger
      class={`${trigger} ${local.class ?? ""}`}
      {...others}
    >
      {local.children}
    </Trigger>
  )
}
