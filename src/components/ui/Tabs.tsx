import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
 
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as TabsPrimitive from "@kobalte/core/tabs"
import stylex from "@stylexjs/stylex"
import { mergeClassname } from "../../utils"
 
const style = stylex.create({
  $tabsList: {
    display: "inline-flex",
    padding: "0.25rem",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.375rem",
    height: "2.5rem"
  },
  $tabsTrigger: {
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
  },
  $tabsContent: {
    marginTop: "0.5rem"
  },
  $tabsIndicator: {
    position: "absolute",
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms"
  }
})
 
const Tabs = TabsPrimitive.Root
 
type TabsListProps<T extends ValidComponent = "div"> = TabsPrimitive.TabsListProps<T> & {
  class?: string | undefined
}
 
const TabsList = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TabsListProps<T>>
) => {
  const [local, others] = splitProps(props as TabsListProps, ["class"])
  return (
    <TabsPrimitive.List
      {...others}
      class={mergeClassname(
        local,
        stylex.attrs(style.$tabsList)
      )}
    />
  )
}
 
type TabsTriggerProps<T extends ValidComponent = "button"> = TabsPrimitive.TabsTriggerProps<T> & {
  class?: string | undefined
}
 
const TabsTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, TabsTriggerProps<T>>
) => {
  const [local, others] = splitProps(props as TabsTriggerProps, ["class"])
  return (
    <TabsPrimitive.Trigger
      class={mergeClassname(local, stylex.attrs(style.$tabsTrigger))}
      {...others}
    />
  )
}
 
type TabsContentProps<T extends ValidComponent = "div"> = TabsPrimitive.TabsContentProps<T> & {
  class?: string | undefined
}
 
const TabsContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TabsContentProps<T>>
) => {
  const [local, others] = splitProps(props as TabsContentProps, ["class"])
  return (
    <TabsPrimitive.Content
      class={mergeClassname(local, stylex.attrs(style.$tabsContent))}
      {...others}
    />
  )
}
 
type TabsIndicatorProps<T extends ValidComponent = "div"> = TabsPrimitive.TabsIndicatorProps<T> & {
  class?: string | undefined
}
 
const TabsIndicator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TabsIndicatorProps<T>>
) => {
  const [local, others] = splitProps(props as TabsIndicatorProps, ["class"])
  return (
    <TabsPrimitive.Indicator
      class={mergeClassname(local, stylex.attrs(style.$tabsIndicator))}
      {...others}
    />
  )
}
 
export { Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator }