import { splitProps, type ValidComponent } from "solid-js"
import { Item, type DropdownMenuItemProps } from "@kobalte/core/dropdown-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { css } from "molcss"

const menuItem = css`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding-block: 0.375rem;
  padding-inline: 0.5rem;
  border-radius: 6px;
  outline-style: none;
  font-size: 0.875rem;
  line-height: 1.25rem;
  user-select: none;
  width: 100%;
`

const menuItem__default = css`
  cursor: default;
  color: var(--subtext0);
  &:hover {
    background-color: var(--surface1);
    color: var(--text);
  }
`

const menuItem__disabled = css`
  cursor: not-allowed;
  color: var(--overlay1);
`

export interface IDropdownMenuItemProps<T extends ValidComponent = "div"> extends DropdownMenuItemProps<T> {
  class?: string | undefined
}

export function DropdownMenuItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IDropdownMenuItemProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuItemProps, ["class"])
  return (
    <Item
      class={`${menuItem} ${props.disabled ? menuItem__disabled : menuItem__default} ${props.class ?? ""}`}
      {...rest}
    />
  )
}
 