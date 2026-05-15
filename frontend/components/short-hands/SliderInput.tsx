import stylex from "@stylexjs/stylex"

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

interface ISliderInputProps extends Omit<HTMLAttributes<"input">, "type"> {
  // define your component props here
}

export function SliderInput(props: ISliderInputProps) {
  return (
    <input
      {...props}
      type="range"
      class={`${props.class ?? ""} ${stylex.attrs(style.slider__input).class}`}
      style={`--slider-progress:${props.value}%`}
    />
  )
}