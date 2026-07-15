import { createSignal, Show, splitProps } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { formatSecondsToMMSS, type EventHandler } from "~/utils"
import type { createMediaPlayer, MediaPlayer } from "~/hooks"
// ...
import { RangeInput } from "./RangeInput"

const slider = css`
  width: 100%;
  position: relative;
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

const slider__tooltip = css`
  position: absolute;
  bottom: 100%; /* Positions it right above the slider */
  left: var(--hover-left-px); /* Switch to pixels for precise bounding */
  transform: translateX(-50%); /* Centers the tooltip on the mouse cursor */
  background-color: var(--base);
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none; /* Prevents tooltip from interfering with mouse events */
  margin-bottom: 8px; 
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

  const [isHovering, setIsHovering] = createSignal(false)
  const [hoverLeftPx, setHoverLeftPx] = createSignal(0)
  const [hoverTime, setHoverTime] = createSignal("")

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

  // Hover Event Handler
  const handleMouseMove: EventHandler<"div", "onMouseMove"> = (mouseEvent) => {
    const rect = mouseEvent.currentTarget.getBoundingClientRect()
    const hoverX = mouseEvent.clientX - rect.left // Mouse X relative to the slider
    
    // 1. Calculate the progress percentage (for time calculation)
    const percentage = Math.max(0, Math.min(100, (hoverX / rect.width) * 100))
    
    // 2. Prevent the tooltip from going out of bounds
    // Let's assume a safe half-width for the tooltip (e.g., ~35px for "00:00:00")
    // If you want it absolutely perfect, we clamp the pixel positioning:
    const tooltipHalfWidth = 35 
    const clampedX = Math.max(tooltipHalfWidth, Math.min(rect.width - tooltipHalfWidth, hoverX))
    
    setHoverLeftPx(clampedX)

    // 3. Convert percentage to seconds
    const totalDuration = props.player$.totalDuration$()
    const hoverSeconds = totalDuration * (percentage / 100)
    setHoverTime(formatSecondsToMMSS(hoverSeconds))
  }

  return (
    <div 
      id="progressSlider"
      style={`--slider-progress:${getCurrentProgress()}%;--hover-left-px:${hoverLeftPx()}px`} 
      class={slider}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Show when={isHovering()}>
        <div class={slider__tooltip}>
          {hoverTime()}
        </div>
      </Show>
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