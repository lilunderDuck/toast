import { type ParentProps, splitProps, type ValidComponent } from "solid-js"
import { type DropdownMenuRadioItemProps, ItemIndicator, RadioItem } from "@kobalte/core/dropdown-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
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
  },
  icon: {
    width: 15,
    height: 15,
    backgroundColor: 'currentColor',
    borderRadius: '50%'
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
        <ItemIndicator {...stylex.attrs(style.icon)} />
      </span>
      {props.children}
    </RadioItem>
  )
}