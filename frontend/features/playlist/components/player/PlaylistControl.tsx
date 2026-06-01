import { BsCaretLeftFill, BsCaretRightFill, BsVolumeMuteFill, BsVolumeUpFill } from "solid-icons/bs"
import type { ParentProps } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { RangeInput, Tooltip } from "~/components"
// ...
import { usePlaylistContext } from "../../provider"
import { PlaylistTogglePlayIcon } from "./PlaylistTogglePlayIcon"

const playlistControl__mainControl = css`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
`

const playlistControl__otherControl = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
  width: 28rem;
`

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

const playlistControl__bigButton = css`
  width: 3.75rem;
  height: 3.75rem;
`

const playlistControl__smallButton = css`
  width: 2.75rem;
  height: 2.75rem;
`

const playlistControl__playButton = css`
  border-radius: 50%;
  background-color: #3d4151;
`

export function PlaylistControl(props: ParentProps) {
  const { shouldDisableNextBtn$, shouldDisablePrevBtn$, currentTrack$, player$, togglePlayTrack$, goToNextTrack$, goToPrevTrack$ } = usePlaylistContext()

  const changeVolume: EventHandler<"input", "onInput"> = (inputEvent) => {
    const newVolume = parseFloat(inputEvent.currentTarget.value)
    player$.setVolume$(newVolume)
  }

  return (
    <>
      <div class={playlistControl__mainControl}>
        <Tooltip label$="Go to previous track">
          <button 
            class={`${playlistControl__bigButton} ${playlistControl__button}`}
            disabled={shouldDisablePrevBtn$()}
            onClick={goToPrevTrack$}
          >
            <BsCaretLeftFill size="1.2rem" />
          </button>
        </Tooltip>
        <button 
          class={`${playlistControl__bigButton} ${playlistControl__button} ${playlistControl__playButton}`}
          disabled={currentTrack$() == null}
          onClick={() => {
            if (currentTrack$() !== null) {
              console.log("toggle track")
              togglePlayTrack$(currentTrack$()!.currentIndex$)
            }
          }}
        >
          <PlaylistTogglePlayIcon state$={player$.state$()} />
        </button>
        <Tooltip label$="Go to next track">
          <button 
            class={`${playlistControl__bigButton} ${playlistControl__button}`}
            disabled={shouldDisableNextBtn$()}
            onClick={goToNextTrack$}
          >
            <BsCaretRightFill size="1.2rem" />
          </button>
        </Tooltip>
      </div>
      <div class={playlistControl__otherControl}>
        {props.children}
        <Tooltip label$={`Click to ${player$.isMuted$() ? "unmute" : "mute"}`}>
          <button 
            class={`${playlistControl__smallButton} ${playlistControl__button}`}
            onClick={player$.toggleMute$}
          >
            {player$.isMuted$() ? <BsVolumeMuteFill size="1.2rem" /> : <BsVolumeUpFill size="1.2rem" />}
          </button>
        </Tooltip>
        <Tooltip label$={`Current volume: ${player$.volume$()}%`}>
          <div>
            <RangeInput 
              min={0} 
              max={100} 
              step={1} 
              value={player$.volume$()}
              onInput={changeVolume}
              style={`--slider-progress:${player$.volume$()}%`}
              disabled={player$.isMuted$()}
            />
          </div>
        </Tooltip>
      </div>
    </>
  )
}