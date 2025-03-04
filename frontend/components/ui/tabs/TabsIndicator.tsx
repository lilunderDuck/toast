import { PolymorphicProps } from "@kobalte/core/polymorphic"
import { splitProps, ValidComponent } from "solid-js"
import { Indicator, TabsIndicatorProps } from "@kobalte/core/tabs"
import { mergeClassname } from "~/utils"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  tabsIndicator: {
    position: "absolute",
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms"
  }
})

export interface ITabsIndicatorProps<T extends ValidComponent = "div"> extends TabsIndicatorProps<T> {
  class?: string | undefined
}
 
export function TabsIndicator<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ITabsIndicatorProps<T>>
) {
  const [local, others] = splitProps(props as ITabsIndicatorProps, ["class"])
  return (
    <Indicator
      class={mergeClassname(local, stylex.attrs(style.tabsIndicator))}
      {...others}
    />
  )
}