import type { Component, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
 
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as PopoverPrimitive from "@kobalte/core/popover"
 
import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  popover: {
    zIndex: 50,
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: "0.375rem",
    borderWidth: "1px",
    outlineStyle: "none",
    width: "18rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    backgroundColor: "var(--gray3)"
  }
})
 
const PopoverTrigger = PopoverPrimitive.Trigger
 
const Popover: Component<PopoverPrimitive.PopoverRootProps> = (props) => {
  return <PopoverPrimitive.Root gutter={4} {...props} />
}
 
type PopoverContentProps<T extends ValidComponent = "div"> =
  PopoverPrimitive.PopoverContentProps<T> & { class?: string | undefined }
 
const PopoverContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, PopoverContentProps<T>>
) => {
  const [local, others] = splitProps(props as PopoverContentProps, ["class"])
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        class={MERGE_CLASS(stylex.attrs(style.popover), local, "component-popover")}
        {...others}
      />
    </PopoverPrimitive.Portal>
  )
}
 
export { Popover, PopoverTrigger, PopoverContent }