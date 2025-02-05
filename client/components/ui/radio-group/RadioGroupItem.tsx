import type { JSX, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as RadioGroupPrimitive from "@kobalte/core/radio-group"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { mergeClassname } from "client/utils"

const style = stylex.create({
  item: { 
    "display": "flex", 
    "marginLeft": "0.5rem", 
    "alignItems": "center",
    gap: 15
  },
  itemControl: {
    "aspectRatio": "1 / 1",
    "borderRadius": "9999px",
    "borderWidth": "1px",
    width: 18,
    height: 18,
    border: '1px solid var(--gray11)'
  },
  itemIndicator: {
    "display": "flex",
    "justifyContent": "center",
    "alignItems": "center",
    "height": "100%",
  },
  itemIndicatorIcon: {"color":"var(--gray11)","fill":"currentColor"}
})

type RadioGroupItemProps<T extends ValidComponent = "div"> =
  & RadioGroupPrimitive.RadioGroupItemProps<T>
  & {
    class?: string | undefined
    children?: JSX.Element
  }
// ...

export function RadioGroupItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupItemProps<T>>,
) {
  const [local, others] = splitProps(props as RadioGroupItemProps, [
    "class",
    "children",
  ])
  
  return (
    <RadioGroupPrimitive.Item
      class={mergeClassname(stylex.attrs(style.item), local)}
      {...others}
    >
      <RadioGroupPrimitive.ItemInput />
      {/* aspect-square size-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 */}
      <RadioGroupPrimitive.ItemControl {...stylex.attrs(style.itemControl)}>
        <RadioGroupPrimitive.ItemIndicator
          {...stylex.attrs(style.itemIndicator)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            {...stylex.attrs(style.itemIndicatorIcon)}
          >
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          </svg>
        </RadioGroupPrimitive.ItemIndicator>
      </RadioGroupPrimitive.ItemControl>
      {local.children}
    </RadioGroupPrimitive.Item>
  )
}
