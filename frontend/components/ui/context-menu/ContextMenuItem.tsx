import { splitProps, type ValidComponent } from "solid-js"
import { Item, type ContextMenuItemProps } from "@kobalte/core/context-menu"
import { PolymorphicProps } from "@kobalte/core/polymorphic"
import { mergeClassname } from "~/utils"
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

export interface IContextMenuItemProps<T extends ValidComponent = "div"> extends ContextMenuItemProps<T> {
  class?: string | undefined
}

export function ContextMenuItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IContextMenuItemProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuItemProps, ["class"])
  return (
    <Item
      class={mergeClassname(
        props,
        stylex.attrs(style.menuItem)
      )}
      {...rest}
    />
  )
}
 