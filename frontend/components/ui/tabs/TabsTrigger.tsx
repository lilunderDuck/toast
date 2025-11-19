import { splitProps, type ValidComponent } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { type TabsTriggerProps, Trigger } from "@kobalte/core/tabs"
import { MERGE_CLASS } from "macro-def"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  tabsTrigger: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.125rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: 500,
    whiteSpace: "nowrap",
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms",
    border: 'none',
  }
})

interface ITabsTriggerProps<T extends ValidComponent = "button"> extends TabsTriggerProps<T> {
  class?: string | undefined
}
 
export function TabsTrigger<T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ITabsTriggerProps<T>>
) {
  const [local, others] = splitProps(props as ITabsTriggerProps, ["class"])
  return (
    <Trigger
      class={MERGE_CLASS(local, stylex.attrs(style.tabsTrigger))}
      {...others}
    />
  )
}