import { type DropdownMenuSeparatorProps, Separator } from "@kobalte/core/dropdown-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { css } from "molcss"
import { splitProps, type ValidComponent } from "solid-js"

const menuSepartor = css`
  padding-inline: -0.25rem;
  padding-block: 0.25rem;
  height: 1px;
`

export interface IDropdownMenuSeparatorProps<
  T extends ValidComponent = "hr"
> extends DropdownMenuSeparatorProps<T> {
  class?: string | undefined
}

export function DropdownMenuSeparator<T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, IDropdownMenuSeparatorProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuSeparatorProps, ["class"])
  return (
    <Separator
      class={`${menuSepartor} ${props.class ?? ""}`}
      {...rest}
    />
  )
}