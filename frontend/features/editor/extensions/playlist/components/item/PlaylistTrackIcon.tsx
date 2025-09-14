import { BsMusicNoteBeamed } from "solid-icons/bs"
import { Show } from "solid-js"
// ...
import __style from "./PlaylistTrackItem.module.css"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  item__noIcon: {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  item__icon: {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: 6,
    background: "center center no-repeat var(--icon-url)"
  },
})

interface IPlaylistTrackIconProps {
  icon$?: string
}

export default function PlaylistTrackIcon(props: IPlaylistTrackIconProps) {
  return (
    <Show when={props.icon$} fallback={
      <div 
        {...stylex.attrs(style.item__noIcon)} 
        id={__style.item__noIcon}
      >
        <BsMusicNoteBeamed />
      </div>
    }>
      <div {...stylex.attrs(style.item__icon)} style={{
        // "--icon-url": macro_escapeCssUrl(`${ASSETS_SERVER_URL}/local-assets/playlist/audio/${props.icon}`)
      }} />
    </Show>
  )
}