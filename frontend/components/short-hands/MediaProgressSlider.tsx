import { createSignal, splitProps } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { RangeInput } from "./RangeInput"
import type { EventHandler } from "~/utils"

const slider = css`
  width: 100%;
`

const slider__input = css`
  width: 100%;
`

const slider__buffered = css`
  width: "var(--slider-buffered-progress)";
  background-color: "var(--surface0)";
  z-index: 0;
  border-radius: 6px;
`

interface ISliderProps {
  progress$: number
  bufferedProgress$: number
  onSliding$?(progressInPercentage: number): any
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
    props.onSliding$?.(dragProgress())
  }

  const updateNewProgress: EventHandler<"input", "onChange"> = () => {
    setIsDragging(false)
    props.onChange$(dragProgress())
  }

  const getCurrentProgress = () => {
    return isDragging() ? dragProgress() : props.progress$
  }

  return (
    <div 
      id="progressSlider"
      style={`--slider-progress:${getCurrentProgress()}%`} 
      class={slider}
    >
      <div 
        class={slider__buffered} 
        style={`--slider-buffered-progress:${props.bufferedProgress$}%`}
      />
      <RangeInput
        class={slider__input}
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