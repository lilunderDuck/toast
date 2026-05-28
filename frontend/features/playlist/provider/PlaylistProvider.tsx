import { createContext, createSignal, type ParentProps, useContext, type Accessor, onMount, Show, type Setter } from "solid-js"
// ...
import type { playlist } from "~/wailsjs/go/models"
import { Playlist_get, Playlist_getAllTrack, Playlist_resyncTrackDuration, Playlist_updateTrack } from "~/wailsjs/go/playlist/Exports"
import { arrayObjects } from "~/utils"
import { createMediaPlayer, type MediaPlayer } from "~/hooks"
import { toast } from "~/libs/solid-toast"
// ...
import { playlistTrackUrl } from "../api"
import { playlistDurationResyncToast } from "../components"

interface ICurrentTrackData {
  data$: playlist.PlaylistTrackData
  currentIndex$: number
}

interface IPlaylistContext {
  data$: Accessor<playlist.PlaylistData | null>
  tracks$: Accessor<playlist.PlaylistTrackData[]>
  _setTracks$: Setter<playlist.PlaylistTrackData[]>
  currentTrack$: Accessor<ICurrentTrackData | null>
  updateTrack$(trackId: number, updatedData: Partial<playlist.PlaylistTrackData>): Promise<void>
  togglePlayTrack$(index: number): void
  resyncTracksDuration$(): Promise<void>
  saveTrackData$(): Promise<void>

  goToPrevTrackIfCan$(): void
  goToNextTrackIfCan$(): void
  shouldDisableNextBtn$: Accessor<boolean>
  shouldDisablePrevBtn$: Accessor<boolean>

  loopingState$: Accessor<PlaylistLoopState>
  setLoopingState$: Setter<PlaylistLoopState>
  player$: MediaPlayer
}

const Context = createContext<IPlaylistContext>()

interface IPlaylistProviderProps {
  playlistId$: string
}

export function PlaylistProvider(props: ParentProps<IPlaylistProviderProps>) {
  const [playlistTracks, setPlaylistTracks] = createSignal<playlist.PlaylistTrackData[]>([])
  const [playlistData, setPlaylistData] = createSignal<playlist.PlaylistData | null>(null)
  const [currentTrack, setCurrentTrack] = createSignal<ICurrentTrackData | null>(null)

  const [shouldDisableNextBtn, setShouldDisableNextBtn] = createSignal(true)
  const [shouldDisablePrevBtn, setShouldDisablePrevBtn] = createSignal(true)

  const [loopingState, setLoopingState] = createSignal(PlaylistLoopState.NO_REPEAT)

  const audioPlayer = createMediaPlayer("audio", {
    onEnded$() {
      if (loopingState() === PlaylistLoopState.REPEAT_ONCE) {
        audioPlayer.play$()
        return
      }
      goToNextTrackIfCan()
    }
  })
  
  onMount(async() => {
    const [data, entries] = await Promise.all([
      Playlist_get(props.playlistId$),
      Playlist_getAllTrack(props.playlistId$)
    ])

    setPlaylistData(data)
    setPlaylistTracks(entries)
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
    let [, currentIndex] = arrayObjects(playlistTracks()).find$(
      it => it.id === currentTrack()!.data$.id
    )
    
    setCurrentTrack(null)
    const nextTrack = playlistTracks()[currentIndex + 1]
    console.log("Next track is", nextTrack)
    if (!nextTrack) {
      if (loopingState() !== PlaylistLoopState.REPEAT_PLAYLIST) {
        setShouldDisableNextBtn(true)
        return
      }
      
      currentIndex = -1
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
    const updatedData = await toast.promise(Playlist_resyncTrackDuration(playlistData()!.id), playlistDurationResyncToast, {
      position: ToastPosition.TOP_RIGHT
    })
    setPlaylistData(updatedData.metadata)
    setPlaylistTracks(updatedData.tracks)
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

  const saveTrackData = async() => {
    console.log("Playlist track is currently saving...")
    Playlist_updateTrack(props.playlistId$, playlistTracks())
  }

  const updateTrack: IPlaylistContext["updateTrack$"] = async(trackId, updatedData) => {
    setPlaylistTracks(prev => arrayObjects(prev).replace$(it => it.id === trackId, updatedData))
    saveTrackData()
  }

  return (
    <Context.Provider value={{
      tracks$: playlistTracks,
      _setTracks$: setPlaylistTracks,
      data$: playlistData,
      togglePlayTrack$: togglePlayTrack,
      currentTrack$: currentTrack,
      resyncTracksDuration$: resyncTracksDuration,
      goToNextTrackIfCan$: goToNextTrackIfCan,
      goToPrevTrackIfCan$: goToPrevTrackIfCan,
      shouldDisableNextBtn$: shouldDisableNextBtn,
      shouldDisablePrevBtn$: shouldDisablePrevBtn,
      loopingState$: loopingState, 
      setLoopingState$: setLoopingState,
      player$: audioPlayer,
      saveTrackData$: saveTrackData,
      updateTrack$: updateTrack,
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