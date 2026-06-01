import { TbOutlineRepeat, TbOutlineRepeatOff, TbOutlineRepeatOnce } from "solid-icons/tb"
import { Match, Switch } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { Tooltip } from "~/components"
// ...
import { usePlaylistContext } from "../../provider"

const playlistControl__button = css`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--overlay2);
  &:disabled {
    color: var(--overlay0) !important;
  }
  &:hover {
    color: var(--text);
  }
`

const playlistControl__smallButton = css`
  width: 2.75rem;
  height: 2.75rem;
`

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
        class={`${playlistControl__smallButton} ${playlistControl__button}`}
        onClick={cycleThrough}
      >
        <Switch>
          <Match when={loopingState$() === PlaylistLoopState.NO_REPEAT}>
            <TbOutlineRepeatOff size="1.2rem" />
          </Match>

          <Match when={loopingState$() === PlaylistLoopState.REPEAT_ONCE}>
            <TbOutlineRepeatOnce size="1.2rem" />
          </Match>

          <Match when={loopingState$() === PlaylistLoopState.REPEAT_PLAYLIST}>
            <TbOutlineRepeat size="1.2rem" />
          </Match>
        </Switch>
      </button>
    </Tooltip>
  )
}