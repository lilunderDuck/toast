import { splitProps, type ValidComponent } from "solid-js"
import { Content, Portal, type DropdownMenuContentProps } from "@kobalte/core/dropdown-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { css } from "molcss"

const menuContent = css`
  overflow: hidden;
  z-index: 50;
  padding-inline: 10px;
  padding-block: 5px;
  border-radius: 0.375rem;
  background-color: var(--base);
  outline: none;
`

export interface IDropdownMenuContentProps<T extends ValidComponent = "div"> extends DropdownMenuContentProps<T> {
  class?: string | undefined
}

export function DropdownMenuContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IDropdownMenuContentProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuContentProps, ["class"])
  return (
    <Portal>
      <Content
        class={`${menuContent} component-dropdown-menu ${props.class ?? ""}`}
        {...rest}
      />
    </Portal>
  )
}