import { css } from "molcss"
// ...
import { formatSecondsToMMSS, getMediaCurrentPercentage, getMediaCurrentTimeByPercentage } from "~/utils"
import { MediaProgressSlider } from "~/components"
// ...
import { usePlaylistContext } from "../../provider"

const player__progressContainer = css`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;
  padding-inline: 10px;
  padding-block: 5px;
`

const player__progressTime = css`
  font-size: 13px;
`

export function PlaylistProgress() {
  const { player$, currentTrack$ } = usePlaylistContext()

  return (
    <div class={player__progressContainer}>
      <span class={player__progressTime}>
        {formatSecondsToMMSS(player$.currentProgress$())}
      </span>
      <MediaProgressSlider 
        bufferedProgress$={player$.bufferedProgress$()}
        onChange$={(percent) => {
          player$.changeCurrentTime$(
            getMediaCurrentTimeByPercentage(percent, player$.totalDuration$())
          )
        }}
        progress$={getMediaCurrentPercentage(player$.currentProgress$(), player$.totalDuration$())}
        disabled={!currentTrack$()}
      />
      <span class={player__progressTime}>
        {formatSecondsToMMSS(player$.totalDuration$())}
      </span>
    </div>
  )
}