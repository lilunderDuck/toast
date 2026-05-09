import stylex from "@stylexjs/stylex"
import { usePlaylistContext } from "../provider"

const style = stylex.create({
  player: {
    width: "100%",
    height: "6rem",
    backgroundColor: "var(--base)",
    marginTop: 10,
    position: "fixed",
    bottom: 0
  },
  player__progressWrap: {
    width: "100%",
    height: 12,
    backgroundColor: "var(--mantle)",
  },
  player__progress: {
    width: "var(--current-progress)",
    height: 12,
    backgroundColor: "var(--blue)",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6
  },
  player__currentTrackWrap: {

  }
})

interface IPlaylistTrackPlayerProps {
  // define your component props here
}

export function PlaylistTrackPlayer(props: IPlaylistTrackPlayerProps) {
  const { player$ } = usePlaylistContext()

  const getCurrentProgress = () => {
    const progress = (player$.currentProgress$() / player$.totalDuration$()) * 100
    return isNaN(progress) ? 0 : progress
  }

  return (
    <div {...stylex.attrs(style.player)}>
      <div {...stylex.attrs(style.player__progressWrap)}>
        <div 
          {...stylex.attrs(style.player__progress)} 
          style={`--current-progress:${getCurrentProgress()}%`}
        />
      </div>
      <div>
        
      </div>
    </div>
  )
}