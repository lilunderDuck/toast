import { createSignal } from "solid-js"

import stylex from "@stylexjs/stylex"
import { FlexCenterY } from "~/components"
import { toHHMMSS } from "../utils"

const style = stylex.create({
  thisThing: {
    width: '100%',
    gap: 15
  },
  progress: {
    width: '100%',
    backgroundColor: 'var(--gray9)',
    height: 5,
    borderRadius: 5
  },
  progressIndiciator: {
    width: 'var(--progress)',
    height: 5,
    backgroundColor: '#037bfc',
    borderRadius: 5
  },
  time: {
    fontSize: 12,
    flexShrink: 0
  }
})

export function createVideoProgressBar() {
  const [progress, setProgress] = createSignal(0)
  const [currentDuration, setCurrentDuration] = createSignal(0)
  const [totalDurationInSec, setTotalDurationInSec] = createSignal<number>()

  return {
    updateProgressBar$(progressInSecond: number) {
      setProgress(progressInSecond / (totalDurationInSec() ?? -1) * 100)
      setCurrentDuration(progressInSecond)
    },
    setTotalDuration$(duration: number) {
      setTotalDurationInSec(duration)
    },
    ProgressBar$() {
      return (
        <FlexCenterY {...stylex.attrs(style.thisThing)}>
          <span {...stylex.attrs(style.time)}>
            {toHHMMSS(currentDuration())}
          </span>
          <div {...stylex.attrs(style.progress)}>
            <div
              {...stylex.attrs(style.progressIndiciator)}
              style={{
                '--progress': `${progress()}%`
              }}
              />
          </div>
          <span {...stylex.attrs(style.time)}>
            {totalDurationInSec() ? toHHMMSS(totalDurationInSec()!) : "--:--"}
          </span>
        </FlexCenterY>
      )
    }
  }
}