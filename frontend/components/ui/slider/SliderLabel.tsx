import { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Label, SliderLabelProps } from "@kobalte/core/slider"
import { ValidComponent } from "solid-js"

export function SliderLabel<T extends ValidComponent = "label">(
  props: PolymorphicProps<T, SliderLabelProps<T>>
) {
  return <Label {...props} />
}
 