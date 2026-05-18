import stylex from "@stylexjs/stylex"
import { CLS } from "macro-def"

const style = stylex.create({
  slider__input: {
    appearance: "none",
    height: 15,
    background: "linear-gradient(90deg, var(--blue) var(--slider-progress), var(--surface0) var(--slider-progress))",
    // change input slider color
    accentColor: "var(--blue)",
    outline: "none",
    borderRadius: 6,
    "::-webkit-slider-thumb": {
      WebkitAppearance: 'none',
      appearance: 'none',
      width: 12,
      height: 20,
      borderRadius: 6,
      background: 'var(--blue)',
      boxShadow: 'none',
    }
  }
})

interface IRangeInputProps extends Omit<HTMLAttributes<"input">, "type"> {
  // define your component props here
}

export function RangeInput(props: IRangeInputProps) {
  return (
    <input
      {...props}
      type="range"
      class={`${props.class ?? ""} ${CLS(style.slider__input)}`}
      style={`--slider-progress:${props.value}%`}
    />
  )
}