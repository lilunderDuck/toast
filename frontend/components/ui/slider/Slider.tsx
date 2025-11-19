import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  Root,
  type SliderRootProps
} from "@kobalte/core/slider"


import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"
import { SliderTrack } from "./SliderTrack"
import { SliderFill } from "./SliderFill"
import { SliderThumb } from "./SliderThumb"

const style = stylex.create({
  root__wrap: {
    width: "100%",
  },
  root: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    touchAction: "none",
    userSelect: "none",
    backgroundColor: "var(--gray5)"
  }
})

export interface ISliderRootProps<T extends ValidComponent = "div"> extends SliderRootProps<T> {
  class?: string | undefined
  fillColor$?: string
}

export function Slider<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ISliderRootProps<T>>
) {
  const [local, others] = splitProps(props as ISliderRootProps, ["class", "fillColor$"])
  return (
    <div 
      class={local.class} 
      style={`--fill-color:${props.fillColor$ ?? "var(--gray6)"}`}
      {...stylex.attrs(style.root__wrap)}
    >
      <Root
        {...stylex.attrs(style.root)}
        {...others}
      >
        <SliderTrack>
          <SliderFill />
          <SliderThumb />
        </SliderTrack>
      </Root>
    </div>
  )
}