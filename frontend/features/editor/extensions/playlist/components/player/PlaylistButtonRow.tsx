import stylex from "@stylexjs/stylex"
import { BsCaretLeftFill, BsCaretRightFill, BsPauseFill, BsPlayFill } from "solid-icons/bs"
import { Show } from "solid-js"
import { Button } from "~/components"

const style = stylex.create({
  buttonRow: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  buttonRow__playOrPauseButton: {
    borderRadius: "50%"
  }
})

export interface IPlaylistButtonRowProps extends IActionHandler<PlaylistButtonRowAction> {
  isPlaying$: boolean
  isDisabled$: boolean
}

export default function PlaylistButtonRow(props: IPlaylistButtonRowProps) {
  const call = (event: PlaylistButtonRowAction) => () => props.action$(event)

  return (
    <div {...stylex.attrs(style.buttonRow)}>
      <Button 
        size$={ButtonSize.ICON}
        disabled={props.isDisabled$}
        onClick={call(PlaylistButtonRowAction.PREVIOUS_TRACK)}
      >
        <BsCaretLeftFill size={30} />
      </Button>
      <Button
        {...stylex.attrs(style.buttonRow__playOrPauseButton)}
        size$={ButtonSize.ICON}
        onClick={call(PlaylistButtonRowAction.TOGGLE_PLAY_TRACK)}
        disabled={props.isDisabled$}
      >
        <Show when={props.isPlaying$} fallback={
          <BsPlayFill size={30} />
        }>
          <BsPauseFill size={30} />
        </Show>
      </Button>
      <Button 
        size$={ButtonSize.ICON}
        disabled={props.isDisabled$}
        onClick={call(PlaylistButtonRowAction.NEXT_TRACK)}
      >
        <BsCaretRightFill size={30} />
      </Button>
    </div>
  )
}