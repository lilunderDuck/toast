import "./PlaylistItem.css"
import { css } from "molcss"
// ...
import type { playlist } from "~/wailsjs/go/models"
import { Tooltip } from "~/components"
import { formatSecondsToMMSS } from "~/utils"
// ...
import { usePlaylistContext } from "../provider"
import { PlaylistIcon } from "./PlaylistIcon"
import { PlaylistTogglePlayIcon } from "./player"

const item = css`
  padding-inline: 10px;
  padding-block: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  &:hover {
    background-color: var(--base);
  }
`

const item__index = css`
  margin-right: 5;
`

const item__playIcon = css`
  padding-left: 8px;
  display: none;
`

const item__trackIndexNumber = css`
  display: block;
`

interface IPlaylistItemProps extends playlist.PlaylistTrackData {
  index$: number
}

export function PlaylistItem(props: IPlaylistItemProps) {
  const { currentTrack$, togglePlayTrack$, player$ } = usePlaylistContext()

  const isCurrentTrack = () => currentTrack$()?.data$.id === props.id

  const determineState = () => {
    if (isCurrentTrack()) {
      return player$.state$()
    }

    return MediaState.PLAYING // to show the play icon
  }

  return (
    <button 
      class={`${item} playlist__trackItem ${currentTrack$()?.data$.id === props.id ? "playlist__currentTrack" : ""}`}
    >
      <Tooltip label$="Play track" tooltipOptions$={{ placement: "right" }}>
        <div 
          class={`${item__index} playlist__trackIndex`}
          onClick={() => togglePlayTrack$(props.index$)}
        >
          <span class={`${item__trackIndexNumber} playlist__trackIndexNumber`}>
            {props.index$ + 1}
          </span>
          <span class={`${item__playIcon} playlist__trackPlayIcon`}>
            <PlaylistTogglePlayIcon state$={determineState()} />
          </span>
        </div>
      </Tooltip>
      <PlaylistIcon size$="2.5rem" icon$={props.icon} />
      <div class="playlist__trackName">
        {props.name}
      </div>
      <div class="playlist__trackArtist">
        {props.artist}
      </div>
      <div class="playlist__trackDuration">
        {formatSecondsToMMSS(props.duration)}
      </div>
    </button>
  )
}