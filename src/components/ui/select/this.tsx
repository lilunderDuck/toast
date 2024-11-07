import type { JSX, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as SelectPrimitive from "@kobalte/core/select"
import stylex from "@stylexjs/stylex"
import { mergeClassname } from "~/utils"
import __style from "./SelectContent.module.css"

const SelectValue = SelectPrimitive.Value
const SelectHiddenSelect = SelectPrimitive.HiddenSelect

const style = stylex.create({
  content: {
    "overflow": "hidden",
    "position": "relative",
    "zIndex": 50,
    "borderRadius": "0.375rem",
    "borderWidth": "1px",
    "boxShadow":
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    backgroundColor: 'var(--gray2)',
  },
  item: {
    "display": "flex",
    "position": "relative",
    "paddingTop": "0.375rem",
    "paddingBottom": "0.375rem",
    "paddingLeft": "0.5rem",
    "paddingRight": "2rem",
    "marginTop": "0",
    "alignItems": "center",
    "borderRadius": "0.125rem",
    "outlineStyle": "none",
    "width": "100%",
    "fontSize": "0.875rem",
    "lineHeight": "1.25rem",
    "cursor": "default",
    "userSelect": "none",
    ':hover': {
      backgroundColor: 'var(--gray3)'
    }
  },
  itemIndicator: {
    "display": "flex",
    "position": "absolute",
    "right": "0.5rem",
    "justifyContent": "center",
    "alignItems": "center",
  },
})

type SelectContentProps<T extends ValidComponent = "div"> =
  & SelectPrimitive.SelectContentProps<T>
  & { class?: string | undefined }
// ...

const SelectContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectContentProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectContentProps, ["class"])
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        class={mergeClassname(local, stylex.attrs(style.content))}
        id={__style.content}
        {...others}
      >
        <SelectPrimitive.Listbox />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

type SelectItemProps<T extends ValidComponent = "li"> =
  & SelectPrimitive.SelectItemProps<T>
  & {
    class?: string | undefined
    children?: JSX.Element
  }
// ...

const SelectItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, SelectItemProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectItemProps, [
    "class",
    "children",
  ])
  return (
    <SelectPrimitive.Item
      class={mergeClassname(local, stylex.attrs(style.item))}
      {...others}
    >
      <SelectPrimitive.ItemIndicator {...stylex.attrs(style.itemIndicator)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l5 5l10 -10" />
        </svg>
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemLabel>
        {local.children}
      </SelectPrimitive.ItemLabel>
    </SelectPrimitive.Item>
  )
}

export {
  SelectContent,
  SelectHiddenSelect,
  SelectItem,
  SelectValue,
}
