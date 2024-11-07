import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Icon, type SelectTriggerProps, Trigger } from "@kobalte/core/select"
import stylex from "@stylexjs/stylex"
import { type JSX, splitProps, type ValidComponent } from "solid-js"
import { mergeClassname } from "~/utils"

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
    "opacity": 0.5,
    width: 20,
    height: 20,
  },
})

interface ISelectTriggerProps<T extends ValidComponent = "button">
  extends SelectTriggerProps<T> {
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
      class={mergeClassname(local, stylex.attrs(style.trigger))}
      {...others}
    >
      {local.children}
      <Icon
        as="svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        {...stylex.attrs(style.icon)}
      >
        <path d="M8 9l4 -4l4 4" />
        <path d="M16 15l-4 4l-4 -4" />
      </Icon>
    </Trigger>
  )
}
