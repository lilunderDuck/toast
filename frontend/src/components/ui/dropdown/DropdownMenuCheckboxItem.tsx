import { splitProps, type ParentProps, type ValidComponent } from "solid-js"
import { CheckboxItem, ItemIndicator, type DropdownMenuCheckboxItemProps } from "@kobalte/core/dropdown-menu"
import { PolymorphicProps } from "@kobalte/core/polymorphic"
import { mergeClassname } from "~/utils"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menuItemIndicator: {
    display: "flex",
    position: "absolute",
    left: "0.5rem",
    justifyContent: "center",
    alignItems: "center"
  },
  menuCheckboxItem: {
    display: "flex",
    position: "relative",
    paddingBlock: '0.375rem',
    paddingRight: "0.5rem",
    paddingLeft: "2rem",
    alignItems: "center",
    borderRadius: "0.125rem",
    outlineStyle: "none",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    transitionProperty: "color, background-color, border-color, text-decoration-color, fill, stroke",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms",
    cursor: "default",
    userSelect: "none"
  },
})

export interface IDropdownMenuCheckboxItemProps<
  T extends ValidComponent = "div"
> extends DropdownMenuCheckboxItemProps<T>, ParentProps {
  class?: string | undefined
}

export function DropdownMenuCheckboxItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IDropdownMenuCheckboxItemProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuCheckboxItemProps, ["class", "children"])
  return (
    <CheckboxItem
      class={mergeClassname(
        props,
        stylex.attrs(style.menuCheckboxItem)
      )}
      {...rest}
    >
      <span class={mergeClassname(stylex.attrs(style.menuItemIndicator))}>
        <ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <path d="M5 12l5 5l10 -10" />
          </svg>
        </ItemIndicator>
      </span>
      {props.children}
    </CheckboxItem>
  )
}