import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import { Content, type HoverCardContentProps, type HoverCardRootProps, Portal, Root, Trigger } from "@kobalte/core/hover-card"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
// ...
import { css } from "molcss"

const hoverCard = css`
  z-index: 50;
  padding-inline: 15;
  padding-block: 10;
  border-radius: 0.375rem;
  border-width: 1px;
  outline-style: none;
  background-color: var(--base);
`

export const HoverCardTrigger = Trigger

export function HoverCard(props: HoverCardRootProps) {
  return <Root gutter={4} {...props} />
}

export interface IHoverCardContentProps<
  T extends ValidComponent = "div"
> extends HoverCardContentProps<T> {
  class?: string | undefined
}

export function HoverCardContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IHoverCardContentProps<T>>
) {
  const [local, others] = splitProps(props as IHoverCardContentProps, ["class"])
  return (
    <Portal>
      <Content
        {...others}
        class={`${hoverCard} component-hover-card ${local.class ?? ""}`}
      />
    </Portal>
  )
}