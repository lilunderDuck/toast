import { type ParentProps, splitProps, type ValidComponent } from "solid-js"
import { type ContextMenuRadioItemProps, ItemIndicator, RadioItem } from "@kobalte/core/context-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { macro_mergeClassnames } from "macro-def"
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

export interface IContextMenuRadioItemProps<
  T extends ValidComponent = "div"
> extends ContextMenuRadioItemProps<T>, ParentProps {
  class?: string | undefined
}

export function ContextMenuRadioItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IContextMenuRadioItemProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuRadioItemProps, ["class", "children"])
  return (
    <RadioItem
      class={macro_mergeClassnames(props.class, stylex.attrs(style.menuRadioItem))}
      {...rest}
    >
      <span {...stylex.attrs(style.menuItemIndicator)}>
        <ItemIndicator {...stylex.attrs(style.icon)} />
      </span>
      {props.children}
    </RadioItem>
  )
}