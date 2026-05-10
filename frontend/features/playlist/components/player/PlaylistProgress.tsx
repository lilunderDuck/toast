import stylex from "@stylexjs/stylex"
// ...
import { formatSecondsToMMSS } from "~/utils"
// ...
import { usePlaylistContext } from "../../provider"

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
  const { player$ } = usePlaylistContext()
  
  const getCurrentProgress = () => {
    const progress = (player$.currentProgress$() / player$.totalDuration$()) * 100
    return isNaN(progress) ? 0 : progress
  }

  return (
    <div {...stylex.attrs(style.player__progressContainer)}>
      <span {...stylex.attrs(style.player__progressTime)}>
        {formatSecondsToMMSS(player$.currentProgress$())}
      </span>
      <div {...stylex.attrs(style.player__progressWrap)}>
        <div
          {...stylex.attrs(style.player__progress)}
          style={`--current-progress:${getCurrentProgress()}%`}
        />
      </div>
      <span {...stylex.attrs(style.player__progressTime)}>
        {formatSecondsToMMSS(player$.totalDuration$())}
      </span>
    </div>
  )
}