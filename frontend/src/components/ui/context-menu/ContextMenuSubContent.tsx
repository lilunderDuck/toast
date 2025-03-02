import { SubContent, type ContextMenuSubContentProps } from "@kobalte/core/context-menu"
import { PolymorphicProps } from "@kobalte/core/polymorphic"
import { splitProps, ValidComponent } from "solid-js"
import { mergeClassname } from "~/utils"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menuSubContent: {
    overflow: "hidden",
    zIndex: 50,
    padding: "0.25rem",
    borderRadius: "0.375rem",
    borderWidth: "1px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    backgroundColor: 'var(--gray2)',
    border: '1px solid var(--gray4)',
  },
})

export interface IContextMenuSubContentProps<
  T extends ValidComponent = "div"
> extends ContextMenuSubContentProps<T> {
  class?: string | undefined
}

export function ContextMenuSubContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IContextMenuSubContentProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuSubContentProps, ["class"])
  return (
    <SubContent
      class={mergeClassname(
        props,
        stylex.attrs(style.menuSubContent)
      )}
      {...rest}
    />
  )
}