import stylex from "@stylexjs/stylex"
import { BsMusicNoteBeamed } from "solid-icons/bs"
import { Show } from "solid-js"
import { playlistIconUrl } from "../api"
import { usePlaylistContext } from "../provider"

const style = stylex.create({
  icon: {
    width: "var(--size)",
    height: "var(--size)",
    borderRadius: 6,
    flexShrink: 0
  },
  icon__noIcon: {
    backgroundColor: "var(--mantle)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  icon__hasIcon: {
    background: "center center no-repeat var(--icon-url)",
    backgroundSize: "contain"
  }
})

interface IPlaylistIconProps {
  size$: string
  icon$?: string
}

export function PlaylistIcon(props: IPlaylistIconProps) {
  const { data$ } = usePlaylistContext()
  return (
    <Show when={props.icon$} fallback={
      <div
        {...stylex.attrs(style.icon, style.icon__noIcon)}
        id="item__icon"
        style={`--size:${props.size$}`}
      >
        <BsMusicNoteBeamed />
      </div>
    }>
      <div
        {...stylex.attrs(style.icon, style.icon__hasIcon)}
        id="item__icon"
        style={`--size:${props.size$};--icon-url:url('${playlistIconUrl(data$()!.id, props.icon$!)}')`}
      />
    </Show>
  )
}