import { css } from "molcss"
// ...
import { PlaylistControl, PlaylistCurrentTrackView, PlaylistLoopButton, PlaylistProgress } from "../components"

const player = css`
  width: 100%;
  background-color: var(--base);
  position: fixed;
  bottom: 0;
`

const player__content = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  gap: 5px;
`

export function PlaylistTrackPlayer() {
  return (
    <div class={player}>
      <PlaylistProgress />
      <div class={player__content}>
        <PlaylistCurrentTrackView />
        <PlaylistControl>
          <PlaylistLoopButton />
        </PlaylistControl>
      </div>
    </div>
  )
}