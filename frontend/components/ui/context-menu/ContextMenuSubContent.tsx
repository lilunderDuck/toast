import { SubContent, type ContextMenuSubContentProps } from "@kobalte/core/context-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
// ...
import { splitProps, type ValidComponent } from "solid-js"
// ...
import { css } from "molcss"

const menuSubContent = css`
  overflow: hidden;
  z-index: 50;
  padding: 0.25rem;
  border-radius: 0.375rem;
  border-width: 1px;
  background-color: var(--base);
`

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
      class={`${menuSubContent} ${props.class ?? ""}`}
      {...rest}
    />
  )
}