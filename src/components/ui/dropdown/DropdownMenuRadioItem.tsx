import { type ParentProps, splitProps, type ValidComponent } from "solid-js"
import { DropdownMenuRadioItemProps, ItemIndicator, RadioItem } from "@kobalte/core/dropdown-menu"
import { PolymorphicProps } from "@kobalte/core/polymorphic"
import { mergeClassname } from "~/utils"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menuRadioItem: {
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
  menuItemIndicator: {
    display: "flex",
    position: "absolute",
    left: "0.5rem",
    justifyContent: "center",
    alignItems: "center"
  }
})

export interface IDropdownMenuRadioItemProps<
  T extends ValidComponent = "div"
> extends DropdownMenuRadioItemProps<T>, ParentProps {
  class?: string | undefined
}

export function DropdownMenuRadioItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IDropdownMenuRadioItemProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuRadioItemProps, ["class", "children"])
  return (
    <RadioItem
      class={mergeClassname(props, stylex.attrs(style.menuRadioItem))}
      {...rest}
    >
      <span {...stylex.attrs(style.menuItemIndicator)}>
        <ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-2 fill-current"
          >
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          </svg>
        </ItemIndicator>
      </span>
      {props.children}
    </RadioItem>
  )
}