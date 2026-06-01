import { Show } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { usePlaylistContext } from "../../provider"
import { PlaylistIcon } from "../PlaylistIcon"

const playlist__currentTrack = css`
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;
  width: 24rem;
  flex-shrink: 1;
`

const playlist__nameAndAuthor = css`
  display: flex;
  align-items: stretch;
  flex-direction: column;
`

export function PlaylistCurrentTrackView() {
  const { currentTrack$ } = usePlaylistContext()
  return (
    <div class={playlist__currentTrack}>
      <Show when={currentTrack$()}>
        <PlaylistIcon size$="4rem" icon$={currentTrack$()?.data$.icon ?? ""} />
        <div class={playlist__nameAndAuthor}>
          <h4>{currentTrack$()!.data$.name}</h4>
          <div>{currentTrack$()!.data$.artist}</div>
        </div>
      </Show>
    </div>
  )
}