import stylex from "@stylexjs/stylex"
import "./PlaylistItem.css"
// ...
import type { playlist } from "~/wailsjs/go/models"
// ...
import { usePlaylistContext } from "../provider"
import { PlaylistIcon } from "./PlaylistIcon"

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
  const { playTrack$, currentTrack$ } = usePlaylistContext()

  return (
    <button 
      {...stylex.attrs(style.item)} 
      data-current-track={currentTrack$()?.id === props.id}
      id="item__playlistItem"
    >
      <div 
        {...stylex.attrs(style.item__index)}
        id="item__index"
        onClick={() => playTrack$(props.index$)}
      >
        {props.index$ + 1}
      </div>
      <PlaylistIcon size$="2.5rem" icon$={props.icon} />
      <div id="item__name">
        {props.name}
      </div>
      <div id="item__artist">
        {props.artist}
      </div>
      <div id="item__duration">
        {props.duration}
      </div>
    </button>
  )
}