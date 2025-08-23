import { type PolymorphicProps } from "@kobalte/core/polymorphic";
import { type SliderValueLabelProps, ValueLabel } from "@kobalte/core/slider";
import { type ValidComponent } from "solid-js";

export function SliderValueLabel<T extends ValidComponent = "label">(
  props: PolymorphicProps<T, SliderValueLabelProps<T>>
) {
  return <ValueLabel {...props} />
}
 