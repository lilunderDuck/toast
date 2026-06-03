import { splitProps, type ValidComponent } from "solid-js"
import { type DropdownMenuGroupLabelProps, GroupLabel } from "@kobalte/core/dropdown-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { css } from "molcss"

const menuGroupLabel = css`
  padding-block: 0.375rem;
  padding-inline: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
`

export interface IDropdownMenuGroupLabelProps<T extends ValidComponent = "span"> extends DropdownMenuGroupLabelProps<T> {
  class?: string | undefined
}

export function DropdownMenuGroupLabel<T extends ValidComponent = "span">(
  props: PolymorphicProps<T, IDropdownMenuGroupLabelProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuGroupLabelProps, ["class"])
  return (
    <GroupLabel
      class={`${menuGroupLabel} ${props.class ?? ""}`}
      {...rest}
    />
  )
}