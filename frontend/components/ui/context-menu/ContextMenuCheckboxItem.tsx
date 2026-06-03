import { splitProps, type ParentProps, type ValidComponent } from "solid-js"
import { CheckboxItem, ItemIndicator, type ContextMenuCheckboxItemProps } from "@kobalte/core/context-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { css } from "molcss"

const menuItemIndicator = css`
  display: flex;
  position: absolute;
  left: 0.5rem;
  justify-content: center;
  align-items: center;
`

const menuCheckboxItem = css`
  display: flex;
  position: relative;
  padding-block: 0.375rem;
  padding-right: 0.5rem;
  padding-left: 2rem;
  align-items: center;
  border-radius: 0.125rem;
  outline-style: none;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  cursor: default;
  user-select: none;
`

const icon = css`
  width: 15;
  height: 15;
`

export interface IContextMenuCheckboxItemProps<
  T extends ValidComponent = "div"
> extends ContextMenuCheckboxItemProps<T>, ParentProps {
  class?: string | undefined
}

export function ContextMenuCheckboxItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IContextMenuCheckboxItemProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuCheckboxItemProps, ["class", "children"])
  return (
    <CheckboxItem
      class={`${menuCheckboxItem} ${props}`}
      {...rest}
    >
      <span class={menuItemIndicator}>
        <ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class={icon}
          >
            <path d="M5 12l5 5l10 -10" />
          </svg>
        </ItemIndicator>
      </span>
      {props.children}
    </CheckboxItem>
  )
}