import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { SliderValueLabelProps, ValueLabel } from "@kobalte/core/slider";
import { ValidComponent } from "solid-js";

export function SliderValueLabel<T extends ValidComponent = "label">(
  props: PolymorphicProps<T, SliderValueLabelProps<T>>
) {
  return <ValueLabel {...props} />
}
 