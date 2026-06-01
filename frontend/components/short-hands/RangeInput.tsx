import { css } from "molcss"

const slider__input = css`
  appearance: none;
  height: 15px;
  background: linear-gradient(90deg, var(--blue) var(--slider-progress), var(--surface0) var(--slider-progress));
  accent-color: var(--blue);
  outline: none;
  border-radius: 6px;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 20px;
    border-radius: 6px;
    background: var(--blue);
    box-shadow: none;
  }
`

interface IRangeInputProps extends Omit<HTMLAttributes<"input">, "type"> {
  // define your component props here
}

export function RangeInput(props: IRangeInputProps) {
  return (
    <input
      {...props}
      type="range"
      class={`${slider__input} ${props.class ?? ""}`}
      style={`--slider-progress:${props.value}%`}
    />
  )
}