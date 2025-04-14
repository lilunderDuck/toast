import stylex from "@stylexjs/stylex"
import __style from "./VideoProgressSlider.module.css"
// ...
import { useVideoDataContext } from "../../data"

const PROGRESS_BAR_HEIGHT = 5

const style = stylex.create({
  progress: {
    width: '100%',
    // backgroundColor: 'var(--gray9)',
    // height: PROGRESS_BAR_HEIGHT,
    // borderRadius: 5,
    // position: 'relative'
  },
  progressIndiciator: {
    width: 'var(--progress)',
    height: PROGRESS_BAR_HEIGHT,
    backgroundColor: '#037bfc',
    borderRadius: 5
  },
  slider: {
    width: '100%',
    border: 'none',
    display: 'block',
    outline: 'none'
  }
})

interface IVideoProgressSliderProps {
  progress$: number
  onChange$(value: number): void
}

export default function VideoProgressSlider(props: IVideoProgressSliderProps) {
  const { data$ } = useVideoDataContext()

  // if you want to change these 2 constants, make sure to update the css code as well.
  const ACTIVE_COLOR = "var(--blue8)"
  const INACTIVE_COLOR = "var(--gray7)"
  const calculateInputProgress = (whichInput: HTMLInputElement) => {
    const 
      value = parseInt(whichInput.value),
      minValue = parseInt(whichInput.min),
      maxValue = parseInt(whichInput.max)
    // ...

    const ratio = (value - minValue) / (maxValue - minValue) * 100
    whichInput.style.background = `linear-gradient(90deg, ${ACTIVE_COLOR} ${ratio}%, ${INACTIVE_COLOR} ${ratio}%)`
  }

  const inputChangedHandler: EventHandler<"input", "onChange"> = (changeEvent) => {
    const currentTarget = changeEvent.currentTarget
    props.onChange$(parseFloat(currentTarget.value))
    calculateInputProgress(currentTarget)
  }
  
  return (
    <div {...stylex.attrs(style.progress)}>
      <input 
        id={__style.inputRange}
        type="range"
        disabled={data$.videoUrl === ""}
        min={0}
        max={100}
        step={0.0001}
        value={props.progress$}
        onChange={inputChangedHandler}
        onInput={(inputEvent) => calculateInputProgress(inputEvent.currentTarget)}
        {...stylex.attrs(style.slider)}
      />
    </div>
  )
}