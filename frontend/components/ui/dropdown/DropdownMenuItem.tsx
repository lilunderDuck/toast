import { splitProps, type ValidComponent } from "solid-js"
import { Item, type DropdownMenuItemProps } from "@kobalte/core/dropdown-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { macro_mergeClassnames } from "macro-def"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    position: "relative",
    paddingBlock: '0.375rem',
    paddingInline: '0.5rem',
    borderRadius: "0.125rem",
    outlineStyle: "none",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    transitionProperty: "color, background-color, border-color, text-decoration-color, fill, stroke",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms",
    cursor: "default",
    userSelect: "none",
    ':hover': {
      backgroundColor: 'var(--gray3)'
    }
  },
})

export interface IDropdownMenuItemProps<T extends ValidComponent = "div"> extends DropdownMenuItemProps<T> {
  class?: string | undefined
}

export function DropdownMenuItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IDropdownMenuItemProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuItemProps, ["class"])
  return (
    <Item
      class={macro_mergeClassnames(
        props,
        stylex.attrs(style.menuItem)
      )}
      {...rest}
    />
  )
}
 