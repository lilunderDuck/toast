import { createContext, createSignal, type ParentProps, useContext, type Accessor, onMount, Show } from "solid-js"
import type { playlist } from "~/wailsjs/go/models"
import { GetAllPlaylistTrack, GetPlaylistData, ResyncDuration,  } from "~/wailsjs/go/playlist/Exports"
import { playlistTrackUrl } from "../api"
import { arrayObjects } from "~/utils"
import { createMediaPlayer, type MediaPlayer } from "~/hooks"

interface ICurrentTrackData {
  data$: playlist.PlaylistTrackData
  currentIndex$: number
}

interface IPlaylistContext {
  data$: Accessor<playlist.PlaylistData | null>
  tracks$: Accessor<playlist.PlaylistTrackData[]>
  togglePlayTrack$(index: number): void
  pauseCurrentTrack$(): void
  currentTrack$: Accessor<ICurrentTrackData | null>
  resyncTracksDuration$(): Promise<void>
  goToPrevTrackIfCan$(): void
  goToNextTrackIfCan$(): void
  shouldDisableNextBtn$: Accessor<boolean>
  shouldDisablePrevBtn$: Accessor<boolean>
  player$: MediaPlayer
}

const Context = createContext<IPlaylistContext>()

interface IPlaylistProviderProps {
  playlistId$: number
}

export function PlaylistProvider(props: ParentProps<IPlaylistProviderProps>) {
  const [playlistTracks, setPlaylistTrack] = createSignal<playlist.PlaylistTrackData[]>([])
  const [playlistData, setPlaylistData] = createSignal<playlist.PlaylistData | null>(null)
  const [currentTrack, setCurrentTrack] = createSignal<ICurrentTrackData | null>(null)

  const [shouldDisableNextBtn, setShouldDisableNextBtn] = createSignal(true)
  const [shouldDisablePrevBtn, setShouldDisablePrevBtn] = createSignal(true)

  const audioPlayer = createMediaPlayer("audio", {
    onEnded$() {
      goToNextTrackIfCan()
    }
  })
  
  onMount(async() => {
    const [data, entries] = await Promise.all([
      GetPlaylistData(props.playlistId$),
      GetAllPlaylistTrack(props.playlistId$)
    ])

    setPlaylistData(data)
    setPlaylistTrack(entries)
  })

  const playTrack = (trackIndex: number) => {
    const MAX_TRACK = playlistTracks().length
    if (trackIndex == 0) {
      setShouldDisablePrevBtn(true)
      setShouldDisableNextBtn(false)
      console.log("Disabled previous button")
    }

    if (trackIndex > 0 && trackIndex < MAX_TRACK) {
      setShouldDisablePrevBtn(false)
      setShouldDisableNextBtn(false)
      console.log("Both button released")
    }

    if (trackIndex == MAX_TRACK) {
      setShouldDisablePrevBtn(false)
      setShouldDisableNextBtn(true)
      console.log("Disabled next button")
    }

    const track = playlistTracks()[trackIndex]
    console.log("Playing track", trackIndex, ", data is:", track)
    if (currentTrack()?.data$?.id !== track.id) {
      audioPlayer.changeSource$(playlistTrackUrl(playlistData()!.id, track.name))
      setCurrentTrack(null)
      setCurrentTrack({
        currentIndex$: trackIndex,
        data$: track
      })
    }
    
    audioPlayer.play$()
  }

  const pauseCurrentlyPlayedTrack = () => {
    audioPlayer.pause$()
  }

  const goToNextTrackIfCan = () => {
    console.log("Going to next track...")
    console.assert(playlistData(), "playlist data have not been fetched yet")
    
    // Extra search to find the track current index.
    // Implementation notes: we also have to handle the case when you dragged 
    // other tracks/currently played tracks to somewhere, that means the index will be changed.
    const [, currentIndex] = arrayObjects(playlistTracks()).find$(
      it => it.id === currentTrack()!.data$.id
    )
    
    setCurrentTrack(null)
    const nextTrack = playlistTracks()[currentIndex + 1]
    console.log("Next track is", nextTrack)
    if (!nextTrack) {
      setShouldDisableNextBtn(true)
      return
    }

    playTrack(currentIndex + 1)
  }


  const goToPrevTrackIfCan = () => {
    console.log("Going to previous track...")
    console.assert(playlistData(), "playlist data have not been fetched yet")
    const [, currentIndex] = arrayObjects(playlistTracks()).find$(
      it => it.id === currentTrack()!.data$.id
    )

    setCurrentTrack(null)
    const prevTrack = playlistTracks()[currentIndex - 1]
    console.log("Prev track is", prevTrack)
    if (!prevTrack) {
      setShouldDisablePrevBtn(true)
      return
    }

    playTrack(currentIndex - 1)
  }

  const resyncTracksDuration = async() => {
    console.assert(playlistData(), "playlist data have not been fetched yet")
    const updatedData = await ResyncDuration(playlistData()!.id)
    setPlaylistData(updatedData.metadata)
    setPlaylistTrack(updatedData.tracks)
  }

  const togglePlayTrack: IPlaylistContext["togglePlayTrack$"] = (index) => {
    if (currentTrack()?.currentIndex$ !== index) {
      playTrack(index)
      return
    }

    if (audioPlayer.state$() === MediaState.PLAYING) {
      pauseCurrentlyPlayedTrack()
    } else {
      playTrack(index)
    }
  }

  return (
    <Context.Provider value={{
      tracks$: playlistTracks,
      data$: playlistData,
      pauseCurrentTrack$: pauseCurrentlyPlayedTrack,
      togglePlayTrack$: togglePlayTrack,
      currentTrack$: currentTrack,
      resyncTracksDuration$: resyncTracksDuration,
      goToNextTrackIfCan$: goToNextTrackIfCan,
      goToPrevTrackIfCan$: goToPrevTrackIfCan,
      shouldDisableNextBtn$: shouldDisableNextBtn,
      shouldDisablePrevBtn$: shouldDisablePrevBtn,
      player$: audioPlayer,
    }}>
      {props.children}
      <Show when={playlistData()}>
        <audioPlayer.Player$ 
          src={playlistTrackUrl(playlistData()!.id, currentTrack()?.data$.filename ?? '')}
        />
      </Show>
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}