import stylex from "@stylexjs/stylex";
import { TbOutlineRepeat, TbOutlineRepeatOff, TbOutlineRepeatOnce } from "solid-icons/tb";
import { Match, Switch } from "solid-js";
import { Tooltip } from "~/components";
import { usePlaylistContext } from "../../provider";

const style = stylex.create({
  playlistControl__mainControl: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    flexShrink: 0
  },
  playlistControl__otherControl: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
    width: "28rem",
  },
  playlistControl__button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "var(--overlay2)",
    ":disabled": {
      color: "var(--overlay0) !important",
    },
    ":hover": {
      color: "var(--text)",
    }
  },
  playlistControl__bigButton: {
    width: "3.75rem",
    height: "3.75rem",
  },
  playlistControl__smallButton: {
    width: "2.75rem",
    height: "2.75rem",
  },
  playlistControl__playButton: {
    borderRadius: "50%",
    backgroundColor: "#3d4151",
  },
  playlistControl__spacer: {
    width: "100%"
  }
})

export function PlaylistLoopButton() {
  const { loopingState$, setLoopingState$ } = usePlaylistContext()

  let currentLoopingState = loopingState$()
  const cycleThrough = () => {
    currentLoopingState += 1
    setLoopingState$(currentLoopingState % 3)
  }

  const getTooltipText = () => {
    switch (loopingState$()) {
      case PlaylistLoopState.REPEAT_ONCE:
        return "Repeat currently played track"
      case PlaylistLoopState.REPEAT_PLAYLIST:
        return "Repeat currently played playlist"
      case PlaylistLoopState.NO_REPEAT:
        return "No looping"
    }
  }

  return (
    <Tooltip label$={getTooltipText()}>
      <button 
        {...stylex.attrs(style.playlistControl__smallButton, style.playlistControl__button)}
        onClick={cycleThrough}
      >
        <Switch>
          <Match when={loopingState$() === PlaylistLoopState.NO_REPEAT}>
            <TbOutlineRepeatOff />
          </Match>

          <Match when={loopingState$() === PlaylistLoopState.REPEAT_ONCE}>
            <TbOutlineRepeatOnce />
          </Match>

          <Match when={loopingState$() === PlaylistLoopState.REPEAT_PLAYLIST}>
            <TbOutlineRepeat />
          </Match>
        </Switch>
      </button>
    </Tooltip>
  )
}