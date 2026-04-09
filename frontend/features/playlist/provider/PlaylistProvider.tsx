import { useParams } from "@solidjs/router"
import { createContext, createSignal, type ParentProps, useContext, type Accessor, onMount } from "solid-js"
import type { playlist } from "~/wailsjs/go/models"
import { GetPlaylistData,  } from "~/wailsjs/go/playlist/Exports"

interface IPlaylistContext {
  data$: Accessor<playlist.PlaylistData | null>
  tracks$: Accessor<playlist.PlaylistTrackData[]>
}

const Context = createContext<IPlaylistContext>()

interface IPlaylistProviderProps {
  playlistId$: number
}

export function PlaylistProvider(props: ParentProps<IPlaylistProviderProps>) {
  const [playlistTracks, setPlaylistTrack] = createSignal<playlist.PlaylistTrackData[]>([])
  const [playlistData, setPlaylistData] = createSignal<playlist.PlaylistData | null>(null)

  onMount(async() => {
    const [data] = await Promise.all([
      GetPlaylistData(props.playlistId$),
    ])

    setPlaylistData(data)
  })

  return (
    <Context.Provider value={{
      tracks$: playlistTracks,
      data$: playlistData
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}