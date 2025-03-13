import { BsFullscreen, BsFullscreenExit } from "solid-icons/bs"
import { Show } from "solid-js"
import { Button, ButtonSizeVariant, Tooltip } from "~/components"
import { ToggleState } from "~/hook"

interface IFullScreenButtonProps {
  toggle$: ToggleState
  videoRef$: () => Ref<"div">
}

export default function FullScreenButton(props: IFullScreenButtonProps) {
  const [isFullscreen, toggleFullscreen] = props.toggle$

  const onClickingThisButton = () => {
    toggleFullscreen()

    if (isFullscreen()) {
      props.videoRef$().requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <Button
      size$={ButtonSizeVariant.icon}
      onClick={onClickingThisButton}
    >
      <Show when={isFullscreen()} fallback={
        <Tooltip label$="Enter fullscreen">
          <BsFullscreen size={15} />
        </Tooltip>
      }>
        <Tooltip label$="Exit fullscreen">
          <BsFullscreenExit size={15} />
        </Tooltip>
      </Show>
    </Button>
  )
}