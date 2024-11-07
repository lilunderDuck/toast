import type { Component, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
 
import * as HoverCardPrimitive from "@kobalte/core/hover-card"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import stylex from "@stylexjs/stylex"
import { mergeClassname } from "../../utils"
 
const HoverCardTrigger = HoverCardPrimitive.Trigger
 
const HoverCard: Component<HoverCardPrimitive.HoverCardRootProps> = (props) => {
  return <HoverCardPrimitive.Root gutter={4} {...props} />
}
 
type HoverCardContentProps<T extends ValidComponent = "div"> =
  HoverCardPrimitive.HoverCardContentProps<T> & {
    class?: string | undefined
  }
// 

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

const HoverCardContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, HoverCardContentProps<T>>
) => {
  const [local, others] = splitProps(props as HoverCardContentProps, ["class"])
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        {...others}
        class={mergeClassname(local, stylex.attrs(style.hoverCard))}
      />
    </HoverCardPrimitive.Portal>
  )
}
 
export { HoverCard, HoverCardTrigger, HoverCardContent }