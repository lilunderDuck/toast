import type { JSX, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Item, ItemControl, ItemIndicator, ItemInput, type RadioGroupItemProps } from "@kobalte/core/radio-group"
// ...
import { css } from "molcss"

const item = css`
  display: flex;
  margin-left: 0.5rem;
  align-items: center;
  gap: 15px;
`

const itemControl = css`
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  width: 18;
  height: 18;
  border: 1px solid var(--subtext0);
`

const itemIndicator = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const itemIndicatorIcon = css`
  color: var(--subtext0);
  fill: currentColor;
`

interface IRadioGroupItemProps<T extends ValidComponent = "div"> extends RadioGroupItemProps<T> {
  class?: string | undefined
  children?: JSX.Element
}

export function RadioGroupItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IRadioGroupItemProps<T>>,
) {
  const [local, others] = splitProps(props as IRadioGroupItemProps, [
    "class",
    "children",
  ])
  
  return (
    <Item
      class={`${item} ${local.class ?? ""}`}
      {...others}
    >
      <ItemInput />
      {/* aspect-square size-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 */}
      <ItemControl class={itemControl}>
        <ItemIndicator class={itemIndicator}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class={itemIndicatorIcon}
          >
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          </svg>
        </ItemIndicator>
      </ItemControl>
      {local.children}
    </Item>
  )
}
