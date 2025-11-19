import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { Input, type SliderThumbProps, Thumb } from "@kobalte/core/slider"
import stylex from "@stylexjs/stylex"
import { type ParentProps, splitProps, type ValidComponent } from "solid-js"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  thumb: {
    display: "block",
    borderRadius: "9999px",
    borderWidth: "2px",
    transitionProperty: "color, background-color, border-color, text-decoration-color, fill, stroke",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms",
    top: 6,
    backgroundColor: "var(--gray8)"
  }
})

interface ISliderThumbProps<
  T extends ValidComponent = "span"
> extends SliderThumbProps<T>, ParentProps {
  class?: string | undefined
}
 
export function SliderThumb<T extends ValidComponent = "span">(
  props: PolymorphicProps<T, ISliderThumbProps<T>>
) {
  const [local, others] = splitProps(props as ISliderThumbProps, ["class", "children"])
  return (
    <Thumb
      class={MERGE_CLASS(stylex.attrs(style.thumb), local)}
      {...others}
    >
      <Input />
    </Thumb>
  )
}
 