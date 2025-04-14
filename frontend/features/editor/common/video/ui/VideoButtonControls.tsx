import { BsPauseFill, BsPlayFill } from "solid-icons/bs"
import { ParentProps, Show } from "solid-js"
// ...
import { Button, ButtonSizeVariant } from "~/components"
import { useToggleState } from "~/hook"
import { useVideoDataContext } from "../data"
// ...

export const enum VideoControlState {
  playing,
  pausing,
  fullscreen,
  unfullscreen
}

export interface IVideoButtonControlsProps {
  onClick$?: (state: VideoControlState) => void
}

export function VideoButtonControls(props: ParentProps<IVideoButtonControlsProps>) {
  const [isPausing, togglePausing] = useToggleState(true)
  const { data$ } = useVideoDataContext()

  return (
    <>
      <Button
        size$={ButtonSizeVariant.icon}
        disabled={data$.videoUrl === ""}
        onClick={() => {
          togglePausing()
          props.onClick$?.(isPausing() ? VideoControlState.pausing : VideoControlState.playing)
        }}
      >
        <Show when={isPausing()} fallback={
          <BsPauseFill size={15} />
        }>
          <BsPlayFill size={15} />
        </Show>
      </Button>
      {props.children}
    </>
  )
}