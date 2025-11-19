import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
 
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { type TabsListProps, List } from "@kobalte/core/tabs"
import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  tabsList: {
    display: "inline-flex",
    padding: "0.25rem",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.375rem",
    height: "2.5rem"
  }
})

export interface ITabsListProps<T extends ValidComponent = "div"> extends TabsListProps<T> {
  class?: string | undefined
}
 
export function TabsList<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ITabsListProps<T>>
) {
  const [local, others] = splitProps(props as ITabsListProps, ["class"])
  return (
    <List
      {...others}
      class={MERGE_CLASS(
        local,
        stylex.attrs(style.tabsList)
      )}
    />
  )
}