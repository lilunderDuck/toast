import { PolymorphicProps } from "@kobalte/core/polymorphic"
import { SliderTrackProps, Track } from "@kobalte/core/slider"
import stylex from "@stylexjs/stylex"
import { splitProps, ValidComponent } from "solid-js"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  track: {"position":"relative","borderRadius":"9999px","width":"100%","height":"0.5rem"}
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
      class={mergeClassname(stylex.attrs(style.track), local)}
      {...others}
    />
  )
}