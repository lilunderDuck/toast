import { createSignal, type VoidComponent } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { FlexCenterY } from "~/components"
import { editorLog } from "~/features/debug"
// ...
import { getCurrentTimeByPercentage, getVideoPercentage, toHHMMSS } from "../../utils"
import VideoProgressSlider from "./VideoProgressSlider"

const style = stylex.create({
  thisThing: {
    width: '100%',
    gap: 15
  },
  time: {
    fontSize: 12,
    flexShrink: 0
  }
})

interface IVideoProgressBarOptions {
  /**Fired when the progress bar slider is moved.
   * @param currentVideoDuration the video current time in seconds
   * @returns *anything*
   */
  onProgressBarChanged$: (currentVideoDuration: number) => any
}

interface IVideoProgressBar {
  /**Updates the progress bar and current duration.
   * @param progressInSeconds The current video duration in seconds.
   * @returns *nothing*
   */
  updateProgressBar$(progressInSeconds: number): void
  /**Sets the total duration of the video in seconds.
   * @param durationInSeconds The total video duration in seconds.
   * @returns *nothing*
   * @note you should call this function when the video is loaded,
   * otherwise the progress bar will not be displayed properly.
   */
  setTotalDuration$(durationInSeconds: number): void
  /**Renders the video progress bar component.
   * It displays the current duration, a slider, and the total duration.
   *
   * @returns `JSX.Element`
   */
  ProgressBar$: VoidComponent
}

/**Creates a video progress bar controller.
 * It manages the video's progress, current duration, and total duration.
 * 
 * And also handle more random stuff? I guess.
 *
 * @param options see {@link IVideoProgressBarOptions} for the progress bar options.
 * @returns An object containing functions to update the progress bar, set the total duration, and render the progress bar component.
 */
export function createVideoProgressBar(options: IVideoProgressBarOptions): IVideoProgressBar {
  const [progress, setProgress] = createSignal(0)
  const [currentDuration, setCurrentDuration] = createSignal(0)
  const [totalDurationInSec, setTotalDurationInSec] = createSignal<number>()

  const getTotalVideoDuration = () => totalDurationInSec() ?? -1

  const progressBarChanged = (currentProgress: number) => {
    const currentTime = getCurrentTimeByPercentage(currentProgress, getTotalVideoDuration())
    //debug-start
    editorLog.logLabel("video", `progress bar slider updated, current time will be`, currentTime)
    //debug-end
    options.onProgressBarChanged$(currentTime)
  }

  const DEFALT_PLACEHOLDER = "--:--:--"

  return {
    updateProgressBar$(progressInSeconds: number) {
      setProgress(getVideoPercentage(progressInSeconds, getTotalVideoDuration()))
      setCurrentDuration(progressInSeconds)
      //debug-start
      editorLog.logLabel("video", `current progress: ${progress()}%, current duration: ${currentDuration()}s`)
      //debug-end
    },
    setTotalDuration$(durationInSeconds: number) {
      setTotalDurationInSec(durationInSeconds)
      //debug-start
      editorLog.logLabel("video", `total video duration updated:`, durationInSeconds)
      //debug-end
    },
    ProgressBar$() {
      return (
        <FlexCenterY {...stylex.attrs(style.thisThing)}>
          <span {...stylex.attrs(style.time)}>
            {toHHMMSS(currentDuration())}
          </span>
          <VideoProgressSlider progress$={progress()} onChange$={progressBarChanged} />
          <span {...stylex.attrs(style.time)}>
            {totalDurationInSec() ? toHHMMSS(totalDurationInSec()!) : DEFALT_PLACEHOLDER}
          </span>
        </FlexCenterY>
      )
    }
  }
}