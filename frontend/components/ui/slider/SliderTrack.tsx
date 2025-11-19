import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { type SliderTrackProps, Track } from "@kobalte/core/slider"
import stylex from "@stylexjs/stylex"
import { splitProps, type ValidComponent } from "solid-js"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  track: {
    position: "relative",
    borderRadius: "50%",
    width: "100%",
    height: "0.5rem"
  }
})

interface ISliderTrackProps<T extends ValidComponent = "div"> extends SliderTrackProps<T> {
  class?: string | undefined
}
 
export function SliderTrack<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ISliderTrackProps<T>>
) {
  const [local, others] = splitProps(props as ISliderTrackProps, ["class"])
  return (
    <Track
      class={MERGE_CLASS(stylex.attrs(style.track), local)}
      {...others}
    />
  )
}