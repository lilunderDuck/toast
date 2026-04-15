import { createContext, createSignal, type ParentProps, useContext, type Accessor, onMount, Show, createEffect } from "solid-js"
import type { playlist } from "~/wailsjs/go/models"
import { GetAllPlaylistTrack, GetPlaylistData,  } from "~/wailsjs/go/playlist/Exports"
import { playlistTrackUrl } from "../api"
import { arrayObjects } from "~/utils"
import { createMediaPlayer, useEventListener, type MediaPlayer } from "~/hooks"

interface IPlaylistContext {
  data$: Accessor<playlist.PlaylistData | null>
  tracks$: Accessor<playlist.PlaylistTrackData[]>
  playTrack$(index: number): void
  pauseCurrentTrack$(): void
  currentTrack$: Accessor<playlist.PlaylistTrackData | null>
  player$: MediaPlayer
}

const Context = createContext<IPlaylistContext>()

interface IPlaylistProviderProps {
  playlistId$: number
}

export function PlaylistProvider(props: ParentProps<IPlaylistProviderProps>) {
  const [playlistTracks, setPlaylistTrack] = createSignal<playlist.PlaylistTrackData[]>([])
  const [playlistData, setPlaylistData] = createSignal<playlist.PlaylistData | null>(null)
  const [currentTrack, setCurrentTrack] = createSignal<playlist.PlaylistTrackData | null>(null)
  const audioPlayer = createMediaPlayer("audio", {
    onEnded$() {
      goToNextTrackIfCan()
    }
  })
  
  let audioRef!: Ref<"audio">

  onMount(async() => {
    const [data, entries] = await Promise.all([
      GetPlaylistData(props.playlistId$),
      GetAllPlaylistTrack(props.playlistId$)
    ])

    setPlaylistData(data)
    setPlaylistTrack(entries)
  })

  const playTrack = (trackIndex: number) => {
    const track = playlistTracks()[trackIndex]
    console.log("Track", trackIndex, "is", track)
    if (currentTrack()?.id === track.id) {
      return console.warn("this track is already played")
    }
    
    audioPlayer.changeSource$(playlistTrackUrl(playlistData()!.id, track.name))
    setCurrentTrack(track)
    audioPlayer.play$()
  }

  const pauseCurrentlyPlayedTrack = () => {
    audioRef.pause()
  }

  const goToNextTrackIfCan = () => {
    if (!currentTrack()) return
    // Extra search to find the track current index.
    // Implementation notes: we also have to handle the case when you dragged 
    // other tracks/currently played tracks to somewhere, that means the index will be changed.
    const [, currentIndex] = arrayObjects(playlistTracks()).find$(
      it => it.id === currentTrack()!.id
    )
    
    setCurrentTrack(null)
    const nextTrack = playlistTracks()[currentIndex + 1]
    if (!nextTrack) return

    playTrack(currentIndex + 1)
  }

  return (
    <Context.Provider value={{
      tracks$: playlistTracks,
      data$: playlistData,
      pauseCurrentTrack$: pauseCurrentlyPlayedTrack,
      playTrack$: playTrack,
      currentTrack$: currentTrack,
      player$: audioPlayer,
    }}>
      {props.children}
      <Show when={playlistData()}>
        <audioPlayer.Player$ 
          src={playlistTrackUrl(playlistData()!.id, currentTrack()?.filename ?? '')}
        />
      </Show>
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}