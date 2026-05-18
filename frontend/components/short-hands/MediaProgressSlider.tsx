import stylex from "@stylexjs/stylex"
import "./MediaProgressSlider.css"
import { createSignal, splitProps } from "solid-js"
import { RangeInput } from "./RangeInput"

const style = stylex.create({
  slider: {
    width: "100%",
    position: "relative"
  },
  slider__input: {
    top: -2,
    width: "100%",  
  },
  slider__progress: {
    width: "var(--slider-progress)",
    backgroundColor: "var(--blue)",
    zIndex: 1,
    borderRadius: 6
  },
  slider__buffered: {
    width: "var(--slider-buffered-progress)",
    backgroundColor: "var(--surface0)",
    zIndex: 0,
    borderRadius: 6
  }
})

interface ISliderProps {
  progress$: number
  bufferedProgress$: number
  onChange$(progressInPercentage: number): any 
  disabled?: boolean
}

export function MediaProgressSlider(props: ISliderProps) {
  const [, itsProps] = splitProps(props, ["bufferedProgress$", "progress$", "onChange$"])
  const [isDragging, setIsDragging] = createSignal(false)
  const [dragProgress, setDragProgress] = createSignal(0)

  const inputIsSliding: EventHandler<"input", "onInput"> = (inputEvent) => {
    const newValue = parseFloat(inputEvent.currentTarget.value)
    setIsDragging(true)
    setDragProgress(newValue)
    console.log("changing", newValue)
  }

  const updateNewProgress: EventHandler<"input", "onChange"> = () => {
    setIsDragging(false)
    props.onChange$(dragProgress())
    console.log("updated")
  }

  const getCurrentProgress = () => {
    return isDragging() ? dragProgress() : props.progress$
  }

  return (
    <div 
      id="progressSlider"
      style={`--slider-progress:${getCurrentProgress()}%`} 
      {...stylex.attrs(style.slider)}
    >
      <div {...stylex.attrs(style.slider__progress)} />
      <div 
        {...stylex.attrs(style.slider__buffered)} 
        style={`--slider-buffered-progress:${props.bufferedProgress$}%`}
      />
      <RangeInput
        {...stylex.attrs(style.slider__input)}
        min={0}
        max={100}
        step={0.0000001}
        value={getCurrentProgress()}
        onInput={inputIsSliding}
        onChange={updateNewProgress}
        id="progressSlider__input"
        {...itsProps}
      />
    </div>
  )
}