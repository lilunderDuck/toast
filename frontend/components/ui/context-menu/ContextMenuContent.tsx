import { splitProps, type ValidComponent } from "solid-js"
import { Content, Portal, type ContextMenuContentProps } from "@kobalte/core/context-menu"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { css } from "molcss"

const menuContent = css`
  overflow: hidden;
  z-index: 50;
  padding: 0.25rem;
  border-radius: 0.375rem;
  background-color: var(--base);
`

export interface IContextMenuContentProps<T extends ValidComponent = "div"> extends ContextMenuContentProps<T> {
  class?: string | undefined
}

export function ContextMenuContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IContextMenuContentProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuContentProps, ["class"])
  return (
    <Portal>
      <Content
        class={`${menuContent} component-context-menu ${props.class ?? ""}`}
        {...rest}
      />
    </Portal>
  )
}