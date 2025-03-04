import { type ContextMenuSeparatorProps, Separator } from "@kobalte/core/context-menu"
import { PolymorphicProps } from "@kobalte/core/polymorphic"
import stylex from "@stylexjs/stylex"
import { splitProps, ValidComponent } from "solid-js"
import { mergeClassname } from "~/utils"

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
      class={mergeClassname(
        props,
        stylex.attrs(style.menuSepartor)
      )}
      {...rest}
    />
  )
}