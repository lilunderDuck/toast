import { BsCaretLeftFill, BsCaretRightFill, BsVolumeUpFill } from "solid-icons/bs"
import { ImLoop } from "solid-icons/im"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Spacer, Tooltip } from "~/components"
// ...
import { usePlaylistContext } from "../../provider"
import { PlaylistTogglePlayIcon } from "./PlaylistTogglePlayIcon"

const style = stylex.create({
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

export function PlaylistControl() {
  const { shouldDisableNextBtn$, shouldDisablePrevBtn$, currentTrack$, player$, togglePlayTrack$, goToNextTrackIfCan$, goToPrevTrackIfCan$ } = usePlaylistContext()

  return (
    <>
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
      <Spacer />
      <Tooltip label$="Click to mute">
        <button {...stylex.attrs(style.playlistControl__smallButton, style.playlistControl__button)}>
          <BsVolumeUpFill size="1.2rem" />
        </button>
      </Tooltip>
      <Tooltip label$="Loop currently played track">
        <button {...stylex.attrs(style.playlistControl__smallButton, style.playlistControl__button)}>
          <ImLoop size="1.2rem" />
        </button>
      </Tooltip>
      <input 
        type="range" 
        min={0} 
        max={100} 
        step={1} 
      />
    </>
  )
}