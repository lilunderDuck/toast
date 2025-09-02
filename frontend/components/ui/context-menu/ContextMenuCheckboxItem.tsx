import { splitProps, type ParentProps, type ValidComponent } from "solid-js"
import { CheckboxItem, ItemIndicator, type ContextMenuCheckboxItemProps } from "@kobalte/core/context-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { macro_mergeClassnames } from "macro-def"
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
  icon: {
    width: 15,
    height: 15
  }
})

export interface IContextMenuCheckboxItemProps<
  T extends ValidComponent = "div"
> extends ContextMenuCheckboxItemProps<T>, ParentProps {
  class?: string | undefined
}

export function ContextMenuCheckboxItem<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IContextMenuCheckboxItemProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuCheckboxItemProps, ["class", "children"])
  return (
    <CheckboxItem
      class={macro_mergeClassnames(
        props,
        stylex.attrs(style.menuCheckboxItem)
      )}
      {...rest}
    >
      <span class={macro_mergeClassnames(stylex.attrs(style.menuItemIndicator))}>
        <ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            {...stylex.attrs(style.icon)}
          >
            <path d="M5 12l5 5l10 -10" />
          </svg>
        </ItemIndicator>
      </span>
      {props.children}
    </CheckboxItem>
  )
}