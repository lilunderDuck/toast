import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { Fill, type SliderFillProps } from "@kobalte/core/slider"
import { splitProps, type ValidComponent } from "solid-js"
import { macro_mergeClassnames } from "macro-def"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  fill: {
    position: "absolute",
    height: "100%",
    backgroundColor: "var(--fill-color)"
  }
})

export interface ISliderFillProps<T extends ValidComponent = "div"> extends SliderFillProps<T> {
  class?: string | undefined
  color$?: string
}
 
export function SliderFill<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ISliderFillProps<T>>
) {
  const [local, others] = splitProps(props as ISliderFillProps, ["class"])
  return (
    <Fill
      class={macro_mergeClassnames(stylex.attrs(style.fill), local)}
      {...others}
    />
  )
}