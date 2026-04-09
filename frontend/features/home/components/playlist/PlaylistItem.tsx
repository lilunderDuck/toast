import { playlist } from "~/wailsjs/go/models"

import stylex from "@stylexjs/stylex"
import { A } from "@solidjs/router"

const style = stylex.create({
  item: {
    width: "15rem",
    height: "15rem",
    borderRadius: 6
  }
})

interface IPlaylistItemProps extends playlist.PlaylistData {
  // define your component props here
}

export function PlaylistItem(props: IPlaylistItemProps) {
  return (
    <A href={`/playlist/${props.id}`}>
      <div {...stylex.attrs(style.item)}>
        <span>{props.name}</span>
      </div>
    </A>
  )
}