import { type DropdownMenuSeparatorProps, Separator } from "@kobalte/core/dropdown-menu"
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
      class={mergeClassname(
        props,
        stylex.attrs(style.menuSepartor)
      )}
      {...rest}
    />
  )
}