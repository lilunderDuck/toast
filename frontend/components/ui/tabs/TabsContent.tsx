import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
 
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Content, type TabsContentProps } from "@kobalte/core/tabs"
import stylex from "@stylexjs/stylex"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  tabsContent: {
    marginTop: "0.5rem"
  }
})

export interface ITabsContentProps<T extends ValidComponent = "div"> extends TabsContentProps<T> {
  class?: string | undefined
}
 
export function TabsContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ITabsContentProps<T>>
) {
  const [local, others] = splitProps(props as ITabsContentProps, ["class"])
  return (
    <Content
      class={mergeClassname(local, stylex.attrs(style.tabsContent))}
      {...others}
    />
  )
}