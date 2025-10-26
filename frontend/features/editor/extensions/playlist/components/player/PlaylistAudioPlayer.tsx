import { usePlaylistContext } from "../../provider"
import __style from "./PlaylistAudioPlayer.module.css"

import stylex from "@stylexjs/stylex"
import { MediaProgressSlider } from "~/components"
import { formatSecondsToMMSS } from "~/utils"
import PlaylistButtonRow, { type IPlaylistButtonRowProps } from "./PlaylistButtonRow"

const style = stylex.create({
  player: {
    position: "absolute",
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--gray4)",
    height: "7rem",
    width: "100%",
    paddingBlock: 10
  },
  player__content: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  player__slider: {
    paddingInline: "2rem",
    fontSize: 12,
    display: "flex",
    alignItems: 'center',
    flexShrink: 0,
    flexGrow: 1,
    gap: 15
  },
  player__playOrPauseButton: {
    borderRadius: "50%"
  }
})

const secondsToPercentage = (currentProgress: number, totalDuration: number) => {
  return (currentProgress / totalDuration) * 100
}

const percentageToCurrentDuration = (currentProgressInPercentage: number, totalDuration: number) => {
  return (currentProgressInPercentage * totalDuration) / 100
}

export function PlaylistAudioPlayer() {
  const { track$, data$ } = usePlaylistContext()

  const controlTrack: IPlaylistButtonRowProps["onClick$"] = (action) => {
    switch (action) {
      case PlaylistButtonRowAction.TOGGLE_PLAY_TRACK:
        const trackId = track$.focusedTrack$()?.trackId$ ?? data$()!.items[0].id
        track$.togglePlayTrack$(trackId)
      break

      default:
        break
    }
  }


  return (
    <div {...stylex.attrs(style.player)} id={__style.player}>
      <PlaylistButtonRow
        isDisabled$={track$.focusedTrack$() == null}
        isPlaying$={track$.focusedTrack$()?.isPlaying$ ?? false}
        onClick$={controlTrack}
      />
      <div {...stylex.attrs(style.player__slider)}>
        <span>
          {formatSecondsToMMSS(track$.media$.currentProgress$())}
        </span>
        <MediaProgressSlider
          bufferedProgress$={track$.media$.bufferedProgress$()}
          progress$={
            secondsToPercentage(track$.media$.currentProgress$(), track$.media$.totalDuration$())
          }
          onChange$={(progressInPercentage) => {
            track$.media$.changeCurrentTime$(
              percentageToCurrentDuration(progressInPercentage, track$.media$.totalDuration$())
            )
          }}
          disabled={track$.focusedTrack$() == null}
        />
        <span>
          {formatSecondsToMMSS(track$.media$.totalDuration$())}
        </span>
      </div>
    </div>
  )
}