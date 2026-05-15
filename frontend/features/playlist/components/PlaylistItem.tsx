import stylex from "@stylexjs/stylex"
import "./PlaylistItem.css"
// ...
import type { playlist } from "~/wailsjs/go/models"
import { Tooltip } from "~/components"
import { formatSecondsToMMSS } from "~/utils"
// ...
import { usePlaylistContext } from "../provider"
import { PlaylistIcon } from "./PlaylistIcon"
import { PlaylistTogglePlayIcon } from "./player"

const style = stylex.create({
  item: {
    paddingInline: 10,
    paddingBlock: 5,
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    ":hover": {
      backgroundColor: "var(--base)"
    }
  },
  item__index: {
    marginRight: 5
  },
  item__hasIcon: {
    background: "center center no-repeat var(--icon-url)",
    backgroundSize: "contain"
  }
})

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
      {...stylex.attrs(style.item)} 
      data-current-track={currentTrack$()?.data$.id === props.id}
      id="item__playlistItem"
    >
      <Tooltip label$="Play track" tooltipOptions$={{ placement: "right" }}>
        <div 
          {...stylex.attrs(style.item__index)}
          id="item__index"
          onClick={() => togglePlayTrack$(props.index$)}
        >
          <span id="item__indexNumber">
            {props.index$ + 1}
          </span>
          <span id="item__playIcon">
            <PlaylistTogglePlayIcon state$={determineState()} />
          </span>
        </div>
      </Tooltip>
      <PlaylistIcon size$="2.5rem" icon$={props.icon} />
      <div id="item__name">
        {props.name}
      </div>
      <div id="item__artist">
        {props.artist}
      </div>
      <div id="item__duration">
        {formatSecondsToMMSS(props.duration)}
      </div>
    </button>
  )
}