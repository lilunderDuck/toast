import { createSignal } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { FlexCenterY } from "~/components"
// ...
import { progressPercentageToCurrentTime, toHHMMSS } from "../../utils"
import VideoProgressSlider from "./VideoProgressSlider"
import { editorLog } from "~/features/debug"

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

export function createVideoProgressBar(
  onProgressBarChanged: (currentVideoDuration: number) => any
) {
  const [progress, setProgress] = createSignal(0)
  const [currentDuration, setCurrentDuration] = createSignal(0)
  const [totalDurationInSec, setTotalDurationInSec] = createSignal<number>()

  const progressBarChanged = (currentProgress: number) => {
    const currentTime = progressPercentageToCurrentTime(currentProgress, totalDurationInSec() ?? -1)
    //debug-start
    editorLog.logLabel("video", `progress bar slider updated, current time will be`, currentTime)
    //debug-end
    onProgressBarChanged(currentTime)
  }

  return {
    updateProgressBar$(progressInSecond: number) {
      setProgress(progressInSecond / (totalDurationInSec() ?? -1) * 100)
      setCurrentDuration(progressInSecond)
      //debug-start
      editorLog.logLabel("video", `current progress: ${progress()}%, current duration: ${currentDuration()}s`)
      //debug-end
    },
    setTotalDuration$(duration: number) {
      setTotalDurationInSec(duration)
      //debug-start
      editorLog.logLabel("video", `total video duration updated:`, duration)
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
            {totalDurationInSec() ? toHHMMSS(totalDurationInSec()!) : "--:--:--"}
          </span>
        </FlexCenterY>
      )
    }
  }
}