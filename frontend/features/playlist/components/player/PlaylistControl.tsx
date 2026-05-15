import { BsCaretLeftFill, BsCaretRightFill, BsVolumeMuteFill, BsVolumeUpFill } from "solid-icons/bs"
import type { ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { SliderInput, Spacer, Tooltip } from "~/components"
// ...
import { usePlaylistContext } from "../../provider"
import { PlaylistTogglePlayIcon } from "./PlaylistTogglePlayIcon"

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
  }
})

export function PlaylistControl(props: ParentProps) {
  const { shouldDisableNextBtn$, shouldDisablePrevBtn$, currentTrack$, player$, togglePlayTrack$, goToNextTrackIfCan$, goToPrevTrackIfCan$ } = usePlaylistContext()

  const changeVolume: EventHandler<"input", "onInput"> = (inputEvent) => {
    const newVolume = parseFloat(inputEvent.currentTarget.value)
    player$.setVolume$(newVolume)
  }

  return (
    <>
      <Spacer />
      <div {...stylex.attrs(style.playlistControl__mainControl)}>
        <Tooltip label$="Go to previous track">
          <button 
            {...stylex.attrs(style.playlistControl__bigButton, style.playlistControl__button)}
            disabled={shouldDisablePrevBtn$()}
            onClick={goToPrevTrackIfCan$}
          >
            <BsCaretLeftFill size="1.2rem" />
          </button>
        </Tooltip>
        <button 
          {...stylex.attrs(style.playlistControl__bigButton, style.playlistControl__button, style.playlistControl__playButton)}
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
            {...stylex.attrs(style.playlistControl__bigButton, style.playlistControl__button)}
            disabled={shouldDisableNextBtn$()}
            onClick={goToNextTrackIfCan$}
          >
            <BsCaretRightFill size="1.2rem" />
          </button>
        </Tooltip>
      </div>
      <Spacer />
      <div {...stylex.attrs(style.playlistControl__otherControl)}>
        {props.children}
        <Tooltip label$={`Click to ${player$.isMuted$() ? "unmute" : "mute"}`}>
          <button 
            {...stylex.attrs(style.playlistControl__smallButton, style.playlistControl__button)}
            onClick={player$.toggleMute$}
          >
            {player$.isMuted$() ? <BsVolumeMuteFill size="1.2rem" /> : <BsVolumeUpFill size="1.2rem" />}
          </button>
        </Tooltip>
        <Tooltip label$={`Current volume: ${player$.volume$()}%`}>
          <div>
            <SliderInput 
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