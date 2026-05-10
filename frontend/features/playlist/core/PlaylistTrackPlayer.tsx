import stylex from "@stylexjs/stylex"
import { PlaylistControl, PlaylistCurrentTrackView, PlaylistLoopButton, PlaylistProgress } from "../components"

const style = stylex.create({
  player: {
    width: "100%",
    backgroundColor: "var(--base)",
    marginTop: 10,
    position: "fixed",
    bottom: 0,
  },
  player__content: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    padding: 10,
    gap: 5
  }
})

export function PlaylistTrackPlayer() {
  return (
    <div {...stylex.attrs(style.player)}>
      <PlaylistProgress />
      <div {...stylex.attrs(style.player__content)}>
        <PlaylistCurrentTrackView />
        <PlaylistControl>
          <PlaylistLoopButton />
        </PlaylistControl>
      </div>
    </div>
  )
}