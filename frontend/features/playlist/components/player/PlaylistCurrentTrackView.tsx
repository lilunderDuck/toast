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
    width: "14rem"
  }
})

export function PlaylistCurrentTrackView() {
  const { currentTrack$ } = usePlaylistContext()
  return (
    <div {...stylex.attrs(style.playlist__currentTrack)}>
      <Show when={currentTrack$()}>
        <PlaylistIcon size$="4rem" icon$={currentTrack$()?.data$.icon ?? ""} />
        <div>
          <div>{currentTrack$()!.data$.name}</div>
          <div>{currentTrack$()!.data$.artist}</div>
        </div>
      </Show>
    </div>
  )
}