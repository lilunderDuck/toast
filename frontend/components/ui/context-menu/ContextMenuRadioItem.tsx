import { type ParentProps, splitProps, type ValidComponent } from "solid-js"
import { type ContextMenuRadioItemProps, ItemIndicator, RadioItem } from "@kobalte/core/context-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { css } from "molcss"

const menuRadioItem = css`
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
  cursor: default;
  user-select: none;
`

const menuItemIndicator = css`
  display: flex;
  position: absolute;
  left: 0.5rem;
  justify-content: center;
  align-items: center;
`

const icon = css`
  width: 15px;
  height: 15px;
  background-color: currentColor;
  border-radius: 50%;
`

export interface IContextMenuRadioItemProps<
  T extends ValidComponent = "div"
> extends ContextMenuRadioItemProps<T>, ParentProps {
  class?: string | undefined
}

export function ContextMenuRadioItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IContextMenuRadioItemProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuRadioItemProps, ["class", "children"])
  return (
    <RadioItem
      class={`${menuRadioItem} ${props.class ?? ""}`}
      {...rest}
    >
      <span class={menuItemIndicator}>
        <ItemIndicator class={icon} />
      </span>
      {props.children}
    </RadioItem>
  )
}