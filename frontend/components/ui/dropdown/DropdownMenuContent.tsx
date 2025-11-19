import { splitProps, type ValidComponent } from "solid-js"
import { Content, Portal, type DropdownMenuContentProps } from "@kobalte/core/dropdown-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { MERGE_CLASS } from "macro-def"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menuContent: {
    overflow: "hidden",
    zIndex: 50,
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: "0.375rem",
    backgroundColor: 'var(--gray3)',
    outline: "none"
  }
})

export interface IDropdownMenuContentProps<T extends ValidComponent = "div"> extends DropdownMenuContentProps<T> {
  class?: string | undefined
}

export function DropdownMenuContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IDropdownMenuContentProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuContentProps, ["class"])
  return (
    <Portal>
      <Content
        class={MERGE_CLASS(
          props,
          stylex.attrs(style.menuContent),
          "data-component-dropdown-menu"
        )}
        {...rest}
      />
    </Portal>
  )
}