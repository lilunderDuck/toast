import { type DropdownMenuSeparatorProps, Separator } from "@kobalte/core/dropdown-menu"
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

export interface IDropdownMenuSeparatorProps<
  T extends ValidComponent = "hr"
> extends DropdownMenuSeparatorProps<T> {
  class?: string | undefined
}

export function DropdownMenuSeparator<T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, IDropdownMenuSeparatorProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuSeparatorProps, ["class"])
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