import { createEffect, createSignal, type Accessor } from "solid-js"
import { playlistTrackUrl } from "~/api"
import { createMediaPlayer, type MediaPlayer } from "~/hooks"
import { arrayObjects } from "~/utils"
import type { editor } from "~/wailsjs/go/models"

/**The state of the currently focused or playing track. */
export type FocusedTrackData = {
  trackId$: number
  isPlaying$: boolean
  index$: number
  name$: string
}

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

      console.assert(lastTrackIndex !== -1, `[impossible to reach] Track ${lastTrack?.trackId$} not found`)
      if (!trackItems()[lastTrackIndex + 1]) {
        setFocusedTrack(null)
      }
    }
  })

  const isCurrentTrackPlaying = (trackId: number) => {
    return focusedTrack()?.trackId$ === trackId && focusedTrack()?.isPlaying$
  }

  const playTrack = (trackId: number) => {
    console.log("About to play track id:", trackId)
    if (isCurrentTrackPlaying(trackId)) {
      console.log("Track already been played:", trackId)
      return
    }

    const [, trackIndex] = arrayObjects(trackItems()).find$(it => it.id === trackId)
    console.assert(trackIndex !== -1, `[impossible to reach] Track ${trackId} not found`)

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

  const pauseTrack = (trackId: number) => {
    if (trackId !== focusedTrack()?.trackId$) return 
    player.pause$()
    setFocusedTrack(prev => ({ ...prev, isPlaying$: false }) as FocusedTrackData)

    console.log("Paused track id:", trackId)
  }

  const togglePlayTrack = (trackId: number) => {
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