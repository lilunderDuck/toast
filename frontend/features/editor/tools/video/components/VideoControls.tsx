import { BsPauseFill, BsPlayFill } from "solid-icons/bs"
import { ParentProps, Show } from "solid-js"
// ...
import { Button, ButtonSizeVariant } from "~/components"
import { useToggleState } from "~/hook"
// ...

export const enum VideoControlState {
  playing,
  pausing,
  fullscreen,
  unfullscreen
}

export interface IVideoControlsProps {
  onClickingSomething$?: (state: VideoControlState) => void
}

export function VideoControls(props: ParentProps<IVideoControlsProps>) {
  const [isPausing, togglePausing] = useToggleState(true)

  return (
    <>
      <Button
        size$={ButtonSizeVariant.icon}
        onClick={() => {
          togglePausing()
          props.onClickingSomething$?.(isPausing() ? VideoControlState.pausing : VideoControlState.playing)
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