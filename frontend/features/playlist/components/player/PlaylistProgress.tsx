import { css } from "molcss"
// ...
import { formatSecondsToMMSS } from "~/utils"
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
        player$={player$}
        disabled={!currentTrack$()}
      />
      <span class={player__progressTime}>
        {formatSecondsToMMSS(player$.totalDuration$())}
      </span>
    </div>
  )
}