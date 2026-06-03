import { splitProps, type ValidComponent } from "solid-js"
import { Item, type ContextMenuItemProps } from "@kobalte/core/context-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { css } from "molcss"

const menuItem = css`
  display: flex;
  align-items: center;
  gap: 1px;
  position: relative;
  padding-block: 0.375rem;
  padding-inline: 0.5rem;
  border-radius: 0.125rem;
  outline-style: none;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  cursor: default;
  user-select: none;
  &:hover {
    background-color: var(--base);
  }
`

export interface IContextMenuItemProps<T extends ValidComponent = "div"> extends ContextMenuItemProps<T> {
  class?: string | undefined
}

export function ContextMenuItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IContextMenuItemProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuItemProps, ["class"])
  return (
    <Item
      class={`${menuItem} ${props.class ?? ""}`}
      {...rest}
    />
  )
}
 