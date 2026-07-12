import { createSignal, splitProps } from "solid-js"
// ...
import { css } from "molcss"
// ...
import type { EventHandler } from "~/utils"
import type { createMediaPlayer, MediaPlayer } from "~/hooks"
// ...
import { RangeInput } from "./RangeInput"

const slider = css`
  width: 100%;
`

const slider__input = css`
  width: 100%;
  cursor: pointer;
`

const slider__buffered = css`
  width: "var(--slider-buffered-progress)";
  background-color: "var(--surface0)";
  z-index: 0;
  border-radius: 6px;
`

interface IMediaProgressSlider {
  disabled?: boolean
  player$: MediaPlayer<"video" | "audio">
}

/**A component that renders the current progress of a video/audio and handles seeking. 
 * 
 * @example
 * ```
 * const mediaPlayer = createMediaPlayer("video") // or "audio"
 * 
 * // use it inside a component.
 * <MediaProgressSlider 
 *   player$={mediaPlayer}
 *   disabled={true} // additionally, you can prevent the slider from being dragged or not by setting this prop here
 * />
 * <mediaPlayer.Player$ />
 * ```
 * 
 * @see {@link createMediaPlayer()}
 * @returns 
 */
export function MediaProgressSlider(props: IMediaProgressSlider) {
  const [, itsProps] = splitProps(props, ["player$"])
  const [isDragging, setIsDragging] = createSignal(false)
  const [dragProgress, setDragProgress] = createSignal(0)

  const inputIsSliding: EventHandler<"input", "onInput"> = (inputEvent) => {
    const newProgressPercentage = parseFloat(inputEvent.currentTarget.value)
    setIsDragging(true)
    setDragProgress(newProgressPercentage)
    updateProgress(newProgressPercentage, false)
  }

  const updateNewProgress: EventHandler<"input", "onChange"> = () => {
    setIsDragging(false)
    updateProgress(dragProgress(), true)
  }

  const updateProgress = (newProgressPercentage: number, shouldUpdate: boolean) => {
    props.player$.changeCurrentTime$(
      props.player$.totalDuration$() * (newProgressPercentage / 100),
      shouldUpdate
    )
  }
  
  const getCurrentProgress = () => {
    return isDragging() ? dragProgress() : getCurrentProgressPercentage(props.player$.currentProgress$(), props.player$.totalDuration$())
  }

  return (
    <div 
      id="progressSlider"
      style={`--slider-progress:${getCurrentProgress()}%`} 
      class={slider}
    >
      <div 
        class={slider__buffered} 
        style={`--slider-buffered-progress:${props.player$.bufferedProgress$()}%`}
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

function getCurrentProgressPercentage(currentProgressInSeconds: number, mediaTotalDuration: number) {
  const progress = (currentProgressInSeconds / mediaTotalDuration) * 100
  return isNaN(progress) ? 0 : progress
}