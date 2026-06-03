import { splitProps, type ValidComponent } from "solid-js"
import { type ContextMenuGroupLabelProps, GroupLabel } from "@kobalte/core/context-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
// ...
import { css } from "molcss"

const menuGroupLabel = css`
  padding-block: 0.375rem;
  padding-inline: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
`

export interface IContextMenuGroupLabelProps<T extends ValidComponent = "span"> extends ContextMenuGroupLabelProps<T> {
  class?: string | undefined
}

export function ContextMenuGroupLabel<T extends ValidComponent = "span">(
  props: PolymorphicProps<T, IContextMenuGroupLabelProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuGroupLabelProps, ["class"])
  return (
    <GroupLabel
      class={`${menuGroupLabel} ${props.class ?? ""}`}
      {...rest}
    />
  )
}