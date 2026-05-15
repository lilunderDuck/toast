import stylex from "@stylexjs/stylex"
// ...
import { formatSecondsToMMSS, getMediaCurrentPercentage, getMediaCurrentTimeByPercentage } from "~/utils"
// ...
import { usePlaylistContext } from "../../provider"
import { MediaProgressSlider } from "~/components"

const style = stylex.create({
  player__progressContainer: {
    width: "100%",
    display: "flex",
    gap: 10,
    alignItems: "center",
    userSelect: "none",
    paddingInline: 10,
    paddingBlock: 5
  },
  player__progressTime: {
    fontSize: 13
  },
  player__progressWrap: {
    width: "100%",
    height: 12,
    backgroundColor: "var(--mantle)",
    borderRadius: 6
  },
  player__progress: {
    width: "var(--current-progress)",
    height: 12,
    backgroundColor: "var(--blue)",
    borderRadius: 6
  },
})

export function PlaylistProgress() {
  const { player$, data$ } = usePlaylistContext()

  return (
    <div {...stylex.attrs(style.player__progressContainer)}>
      <span {...stylex.attrs(style.player__progressTime)}>
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
        disabled={!data$()}
      />
      <span {...stylex.attrs(style.player__progressTime)}>
        {formatSecondsToMMSS(player$.totalDuration$())}
      </span>
    </div>
  )
}