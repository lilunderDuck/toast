import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { Item, ItemIndicator, ItemLabel, type SelectItemProps } from "@kobalte/core/select"
import { css } from "molcss"
import { splitProps, type ParentProps, type ValidComponent } from "solid-js"

const item = css`
  display: flex;
  position: relative;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  padding-left: 0.5rem;
  padding-right: 2rem;
  margin-top: 0;
  align-items: center;
  border-radius: 0.125rem;
  outline-style: none;
  width: 100%;
  line-height: 1.25rem;
  cursor: default;
  user-select: none;
  &:hover {
    background-color: var(--surface1);
  }
`

const itemIndicator = css`
  display: flex;
  position: absolute;
  right: 0.5rem;
  justify-content: center;
  align-items: center;
`

const itemIndicator__icon = css`
  width: 1rem;
  height: 1rem;
`

export interface ISelectItemProps<
  T extends ValidComponent = "li"
> extends SelectItemProps<T>, ParentProps {
  class?: string | undefined
}

export const SelectItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, ISelectItemProps<T>>,
) => {
  const [local, others] = splitProps(props as ISelectItemProps, [
    "class",
    "children",
  ])
  
  return (
    <Item
      {...others}
      class={`${item} ${local.class ?? ""}`}
    >
      <ItemIndicator class={itemIndicator}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class={itemIndicator__icon}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l5 5l10 -10" />
        </svg>
      </ItemIndicator>
      <ItemLabel>
        {local.children}
      </ItemLabel>
    </Item>
  )
}