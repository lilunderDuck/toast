import { SubContent, type ContextMenuSubContentProps } from "@kobalte/core/context-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { splitProps, type ValidComponent } from "solid-js"
import { mergeClassname } from "~/utils"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menuSubContent: {
    overflow: "hidden",
    zIndex: 50,
    padding: "0.25rem",
    borderRadius: "0.375rem",
    borderWidth: "1px",
    backgroundColor: 'var(--gray3)',
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