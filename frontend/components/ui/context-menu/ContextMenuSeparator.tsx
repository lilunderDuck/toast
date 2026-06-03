import { type ContextMenuSeparatorProps, Separator } from "@kobalte/core/context-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
// ...
import { css } from "molcss"
// ...
import { splitProps, type ValidComponent } from "solid-js"

const menuSepartor = css`
  padding-inline: -0.25rem;
  padding-block: 0.25rem;
  height: 1px;
`

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
      class={`${menuSepartor} ${props.class}`}
      {...rest}
    />
  )
}