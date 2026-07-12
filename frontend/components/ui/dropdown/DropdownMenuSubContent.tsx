import { SubContent, type DropdownMenuSubContentProps } from "@kobalte/core/dropdown-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { splitProps, type ValidComponent } from "solid-js"
import { css } from "molcss"

const menuSubContent = css`
  overflow: hidden;
  z-index: 50;
  padding: 0.25rem;
  border-radius: 0.375rem;
  border-width: 1px;
  background-color: var(--mantle);
  border: 1px solid var(--surface0);
`

export interface IDropdownMenuSubContentProps<
  T extends ValidComponent = "div"
> extends DropdownMenuSubContentProps<T> {
  class?: string | undefined
}

export function DropdownMenuSubContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IDropdownMenuSubContentProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuSubContentProps, ["class"])
  return (
    <SubContent
      class={`${menuSubContent} ${props.class ?? ""}`}
      {...rest}
    />
  )
}