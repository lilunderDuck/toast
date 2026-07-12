import type { Component, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Content, Portal, Root, Trigger, type PopoverRootProps, type PopoverContentProps as _PopoverContentProps } from "@kobalte/core/popover"
// ... 
import { css } from "molcss"

const popover = css`
  z-index: 50;
  padding-inline: 10px;
  padding-block: 5px;
  border-radius: 0.375rem;
  border-width: 1px;
  outline-style: none;
  min-width: 18rem;
  background-color: var(--base);
`

const PopoverTrigger = Trigger
 
const Popover: Component<PopoverRootProps> = (props) => {
  return <Root gutter={4} {...props} />
}
 
type PopoverContentProps<T extends ValidComponent = "div"> =
  _PopoverContentProps<T> & { class?: string | undefined }
 
const PopoverContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, PopoverContentProps<T>>
) => {
  const [local, others] = splitProps(props as PopoverContentProps, ["class"])
  return (
    <Portal>
      <Content
        class={`${popover} component-popover ${local.class ?? ""}`}
        {...others}
      />
    </Portal>
  )
}
 
export { Popover, PopoverTrigger, PopoverContent }