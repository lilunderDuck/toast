import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { Fill, type SliderFillProps } from "@kobalte/core/slider"
import { splitProps, type ValidComponent } from "solid-js"
import { mergeClassname } from "~/utils"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  fill: {
    position: "absolute",
    borderRadius: "50%",
    height: "100%"
  }
})

export interface ISliderFillProps<T extends ValidComponent = "div"> extends SliderFillProps<T> {
  class?: string | undefined
}
 
export function SliderFill<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ISliderFillProps<T>>
) {
  const [local, others] = splitProps(props as ISliderFillProps, ["class"])
  return (
    <Fill
      class={mergeClassname(stylex.attrs(style.fill), local)}
      {...others}
    />
  )
}