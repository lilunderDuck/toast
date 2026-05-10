import { BsPauseFill, BsPlayFill } from "solid-icons/bs";
import { Show } from "solid-js";

interface IPlaylistTogglePlayIconProps {
  state$: MediaState
}

export function PlaylistTogglePlayIcon(props: IPlaylistTogglePlayIconProps) {
  return (
    <Show when={props.state$ === MediaState.PLAYING} fallback={
      <BsPauseFill size="2.35rem" />
    }>
      <BsPlayFill size="2.35rem" />
    </Show>
  )
}