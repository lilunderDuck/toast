import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { Label, type SliderLabelProps } from "@kobalte/core/slider"
import { type ValidComponent } from "solid-js"

export function SliderLabel<T extends ValidComponent = "label">(
  props: PolymorphicProps<T, SliderLabelProps<T>>
) {
  return <Label {...props} />
}
 