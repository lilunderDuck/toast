import { Show } from "solid-js"
import stylex from "@stylexjs/stylex"
// ...
import { usePlaylistContext } from "../../provider"
import { PlaylistIcon } from "../PlaylistIcon"

const style = stylex.create({
  playlist__currentTrack: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    userSelect: "none",
    width: "24rem",
    flexShrink: 0
  },
  playlist__nameAndAuthor: {
    display: "flex",
    alignItems: "stretch",
    flexDirection: "column"
  },
})

export function PlaylistCurrentTrackView() {
  const { currentTrack$ } = usePlaylistContext()
  return (
    <>
      <div {...stylex.attrs(style.playlist__currentTrack)}>
        <Show when={currentTrack$()}>
          <PlaylistIcon size$="4rem" icon$={currentTrack$()?.data$.icon ?? ""} />
          <div {...stylex.attrs(style.playlist__nameAndAuthor)}>
            <h4>{currentTrack$()!.data$.name}</h4>
            <div>{currentTrack$()!.data$.artist}</div>
          </div>
        </Show>
      </div>
      <div />
    </>
  )
}