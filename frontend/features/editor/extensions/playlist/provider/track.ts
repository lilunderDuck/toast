import { createEffect, createSignal } from "solid-js"
// ...
import { playlistTrackUrl } from "~/api"
import { type MediaPlayer } from "~/hooks"
import { arrayObjects } from "~/utils"
import type { editor } from "~/wailsjs/go/models"
// ...
import type { FocusedTrackData, PlaylistItemId } from "./types"

export function createTrackPlayerManager(
  player: MediaPlayer,
  data: () => editor.PlaylistMetadata
) {
  const [focusedTrack, setFocusedTrack] = createSignal<FocusedTrackData | null>(null)
  const trackItems = () => data().items

  createEffect(() => {
    const currentState = player.state$()
    if (currentState === MediaState.COMPLETED) {
      const lastTrack = focusedTrack()
      const [, lastTrackIndex] = arrayObjects(trackItems()).find$(it => it.id === lastTrack?.trackId$)
      console.assert(lastTrackIndex !== -1, `Track ${lastTrack?.trackId$} not found`)

      const nextTrack = trackItems()[lastTrackIndex + 1]
      if (!nextTrack) {
        setFocusedTrack(null)
      }
    }
  })

  const isCurrentTrackPlaying = (trackId: PlaylistItemId) => {
    return focusedTrack()?.trackId$ === trackId && focusedTrack()?.isPlaying$
  }

  const playTrack = (trackId: PlaylistItemId) => {
    console.log("About to play track id:", trackId)
    if (isCurrentTrackPlaying(trackId)) {
      console.log("Track already been played:", trackId)
      return
    }

    const [, trackIndex] = arrayObjects(trackItems()).find$(it => it.id === trackId)
    console.assert(trackIndex !== -1, `Track ${trackId} not found`)

    const currentTrackData = trackItems()[trackIndex]
    if (focusedTrack()?.trackId$ !== trackId) {
      player.changeSource$(playlistTrackUrl(data().id, currentTrackData.fileName))
    }

    player.play$()
    
    setFocusedTrack({
      index$: trackIndex,
      isPlaying$: true,
      trackId$: currentTrackData.id,
      name$: currentTrackData.fileName
    })

    console.log("Playing track id:", trackId)
  }

  const pauseTrack = (trackId: PlaylistItemId) => {
    if (trackId !== focusedTrack()?.trackId$) {
      return console.log("Track", trackId, "is already paused.")
    }
    player.pause$()
    setFocusedTrack(prev => ({ ...prev, isPlaying$: false }) as FocusedTrackData)

    console.log("Paused track id:", trackId)
  }

  const togglePlayTrack = (trackId: PlaylistItemId) => {
    if (focusedTrack()?.trackId$ === trackId) {
      focusedTrack()!.isPlaying$ ? pauseTrack(trackId) : playTrack(trackId)
    } else {
      playTrack(trackId)
    }
  }

  return {
    focusedTrack$: focusedTrack,
    play$: playTrack,
    pause$: pauseTrack,
    togglePlayTrack$: togglePlayTrack,
    media$: player
  }
}