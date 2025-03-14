import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
 
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  Root,
  SliderRootProps
} from "@kobalte/core/slider"
 

import stylex from "@stylexjs/stylex"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  root: {"display":"flex","position":"relative","flexDirection":"column","alignItems":"center","width":"100%","touchAction":"none","userSelect":"none"}
})

export interface ISliderRootProps<T extends ValidComponent = "div"> extends SliderRootProps<T> {
  class?: string | undefined
} 
 
export function Slider<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ISliderRootProps<T>>
) {
  const [local, others] = splitProps(props as ISliderRootProps, ["class"])
  return (
    <Root
      class={mergeClassname(stylex.attrs(style.root), local)}
      {...others}
    />
  )
}