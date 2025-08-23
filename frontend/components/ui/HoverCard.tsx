import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"

import { Content, type HoverCardContentProps, type HoverCardRootProps, Portal, Root, Trigger } from "@kobalte/core/hover-card"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import stylex from "@stylexjs/stylex"
import { mergeClassname } from "../../utils"

const style = stylex.create({
  hoverCard: {
    zIndex: 50,
    paddingInline: 15,
    paddingBlock: 10,
    borderRadius: "0.375rem",
    borderWidth: "1px",
    outlineStyle: "none",
    backgroundColor: 'var(--gray3)',
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  }
})

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
        class={mergeClassname(local, stylex.attrs(style.hoverCard))}
      />
    </Portal>
  )
}