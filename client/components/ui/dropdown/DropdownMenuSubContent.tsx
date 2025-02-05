import { SubContent, type DropdownMenuSubContentProps } from "@kobalte/core/dropdown-menu"
import { PolymorphicProps } from "@kobalte/core/polymorphic"
import { splitProps, ValidComponent } from "solid-js"
import { mergeClassname } from "client/utils"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menuSubContent: {
    overflow: "hidden",
    zIndex: 50,
    padding: "0.25rem",
    borderRadius: "0.375rem",
    borderWidth: "1px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
})

export interface IDropdownMenuSubContentProps<
  T extends ValidComponent = "div"
> extends DropdownMenuSubContentProps<T> {
  class?: string | undefined
}

export function DropdownMenuSubContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IDropdownMenuSubContentProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuSubContentProps, ["class"])
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