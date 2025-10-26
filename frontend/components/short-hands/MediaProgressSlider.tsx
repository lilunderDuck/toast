import stylex from "@stylexjs/stylex"
import __style from "./MediaProgressSlider.module.css"
import { createSignal, splitProps } from "solid-js"

const style = stylex.create({
  slider: {
    width: "100%",
    position: "relative"
  },
  slider__input: {
    appearance: 'none',
    width: '100%',
    background: 'var(--gray6)',
    outline: 'none',
    opacity: 0.7,
    position: "absolute",
    transition: 'opacity .2s',
    ":hover": {
      opacity: 1
    },
    "::-webkit-slider-thumb": {
      cursor: "pointer",
      appearance: 'none',
      backgroundColor: "var(--blue9)",
    }
  },
  slider__progress: {
    width: "var(--slider-progress)",
    backgroundColor: "var(--blue9)",
    zIndex: 1
  },
  slider__buffered: {
    width: "var(--slider-buffered-progress)",
    backgroundColor: "var(--gray4)",
    zIndex: 0
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
    <div id={__style.slider} {...stylex.attrs(style.slider)} style={{
      "--slider-progress": `${getCurrentProgress()}%`,
      "--slider-buffered-progress": `${props.bufferedProgress$}%`
    }}>
      <div {...stylex.attrs(style.slider__progress)} />
      <div {...stylex.attrs(style.slider__buffered)} />
      <input
        {...stylex.attrs(style.slider__input)}
        type="range"
        min={0}
        max={100}
        step={0.0000001}
        value={getCurrentProgress()}
        onInput={inputIsSliding}
        onChange={updateNewProgress}
        {...itsProps}
      />
    </div>
  )
}