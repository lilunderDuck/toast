import { type ContextMenuSeparatorProps, Separator } from "@kobalte/core/context-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import stylex from "@stylexjs/stylex"
import { splitProps, type ValidComponent } from "solid-js"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  menuSepartor: {
    paddingInline: '-0.25rem',
    paddingBlock: '0.25rem',
    height: "1px"
  }
})

export interface IContextMenuSeparatorProps<
  T extends ValidComponent = "hr"
> extends ContextMenuSeparatorProps<T> {
  class?: string | undefined
}

export function ContextMenuSeparator<T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, IContextMenuSeparatorProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuSeparatorProps, ["class"])
  return (
    <Separator
      class={MERGE_CLASS(
        props,
        stylex.attrs(style.menuSepartor)
      )}
      {...rest}
    />
  )
}