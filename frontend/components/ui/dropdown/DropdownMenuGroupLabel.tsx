import { splitProps, type ValidComponent } from "solid-js"
import { type DropdownMenuGroupLabelProps, GroupLabel } from "@kobalte/core/dropdown-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { MERGE_CLASS } from "macro-def"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menuGroupLabel: {
    paddingBlock: '0.375rem',
    paddingInline: '0.5rem',
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: 600
  },
})

export interface IDropdownMenuGroupLabelProps<T extends ValidComponent = "span"> extends DropdownMenuGroupLabelProps<T> {
  class?: string | undefined
}

export function DropdownMenuGroupLabel<T extends ValidComponent = "span">(
  props: PolymorphicProps<T, IDropdownMenuGroupLabelProps<T>>
) {
  const [, rest] = splitProps(props as IDropdownMenuGroupLabelProps, ["class"])
  return (
    <GroupLabel
      class={MERGE_CLASS(
        props,
        stylex.attrs(style.menuGroupLabel)
      )}
      {...rest}
    />
  )
}