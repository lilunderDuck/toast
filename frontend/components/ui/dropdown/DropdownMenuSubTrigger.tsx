import { type DropdownMenuSubTriggerProps, SubTrigger } from "@kobalte/core/dropdown-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { type ParentProps, splitProps, type ValidComponent } from "solid-js"
import { Spacer } from "../Flex"
import { css } from "molcss"

const menuSubContent = css`
  overflow: hidden;
  z-index: 50;
  padding: 0.25rem;
  border-radius: 0.375rem;
  border-width: 1px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-size: 0.875rem;
  user-select: none;
`

const iconWrap = css`
  display: flex;
  align-items: center;
`

const icon = css`
  width: 15;
  height: 15;
`

export interface IDropdownMenuSubTriggerProps<
  T extends ValidComponent = "div"
> extends DropdownMenuSubTriggerProps<T>, ParentProps {
  class?: string | undefined
} 
// ...

export function DropdownMenuSubTrigger<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IDropdownMenuSubTriggerProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuSubTriggerProps, ["class", "children"])
  return (
    <SubTrigger
      class={`${menuSubContent} ${props.class ?? ""}`}
      {...rest}
    >
      <div class={iconWrap}>
        {props.children}
        <Spacer />
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
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </div>
    </SubTrigger>
  )
}