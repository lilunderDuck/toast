import { BsMusicNoteBeamed } from "solid-icons/bs"
import { Show } from "solid-js"
import { playlistIconUrl } from "../api"
import { usePlaylistContext } from "../provider"
import { css } from "molcss"

const icon = css`
  width: var(--size);
  height: var(--size);
  border-radius: 6px;
  flex-shrink: 0;
`

const icon__noIcon = css`
  background-color: var(--mantle);
  display: flex;
  justify-content: center;
  align-items: center;
`

const icon__hasIcon = css`
  background: center center no-repeat var(--icon-url);
  background-size: contain;
`

interface IPlaylistIconProps {
  size$: string
  icon$?: string
}

export function PlaylistIcon(props: IPlaylistIconProps) {
  const { data$ } = usePlaylistContext()
  return (
    <Show when={props.icon$} fallback={
      <div
        class={`${icon} ${icon__noIcon}`}
        id="item__icon"
        style={`--size:${props.size$}`}
      >
        <BsMusicNoteBeamed />
      </div>
    }>
      <div
        class={`${icon} ${icon__hasIcon}`}
        id="item__icon"
        style={`--size:${props.size$};--icon-url:url('${playlistIconUrl(data$()!.id, props.icon$!)}')`}
      />
    </Show>
  )
}