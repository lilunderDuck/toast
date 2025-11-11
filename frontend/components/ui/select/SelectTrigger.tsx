import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Icon, type SelectTriggerProps, Trigger } from "@kobalte/core/select"
import stylex from "@stylexjs/stylex"
import { type JSX, Show, splitProps, type ValidComponent } from "solid-js"
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  trigger: {
    display: "flex",
    paddingBlock: 5,
    paddingInline: "0.75rem",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "0.375rem",
    width: "100%",
    fontSize: "0.875rem",
    backgroundColor: "transparent",
  },
  icon: {
    opacity: 0.5,
    width: 20,
    height: 20,
  },
})

interface ISelectTriggerProps<T extends ValidComponent = "button"> extends SelectTriggerProps<T> {
  class?: string | undefined
  children?: JSX.Element
}

export function SelectTrigger<T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ISelectTriggerProps<T>>,
) {
  const [local, others] = splitProps(props as ISelectTriggerProps<T>, [
    "class",
    "children",
  ])

  return (
    // @ts-ignore
    <Trigger
      class={macro_mergeClassnames(local, stylex.attrs(style.trigger))}
      {...others}
    >
      {local.children}
    </Trigger>
  )
}
