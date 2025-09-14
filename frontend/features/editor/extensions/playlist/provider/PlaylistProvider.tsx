import { type Accessor, createContext, createSignal, onMount, type ParentProps, Show, useContext } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { useNodeState } from "~/features/editor/utils"
import { CreatePlaylist, UpdatePlaylistData, CreatePlaylistItem, GetPlaylist } from "~/wailsjs/go/editor/EditorExport"
import type { editor } from "~/wailsjs/go/models"
import { playlistTrackUrl } from "~/api"
// ...
import type { PlaylistAttribute } from "../extension"

export interface IPlaylistContext {
  data$: () => editor.PlaylistMetadata | undefined
  createPlaylist$(options: editor.PlaylistOptions): Promise<void>
  editPlaylist$(options: editor.PlaylistOptions): Promise<void>
  addTrack$(options: editor.CreatePlaylistItemOptions): void
  updateTrack$(trackIndex: number, options: editor.CreatePlaylistItemOptions): Promise<void>
  togglePlayTrack$(data: editor.PlaylistItemData): void
  focusedTrack$: Accessor<FocusedTrackData | null>
  playlistId$(): number
}

export type FocusedTrackData = {
  trackId$: number
  isPlaying$: boolean
  isLoading$: boolean
  filename$: string
}

const Context = createContext<IPlaylistContext>()

export function PlaylistProvider(props: ParentProps) {
  const [data, setData] = createStore() as SolidStore<editor.PlaylistMetadata | undefined>

  const { updateAttribute$, data$ } = useNodeState<PlaylistAttribute>()
  const playlistId = () => data$().id

  setData("items", () => [
    { id: 12120940, name: "test", author: "test author", fileName: "test.mp3" },
    { id: 57986430, name: "test 1", author: "test author", fileName: "test.mp3" },
    { id: 79503086, name: "test 2", author: "test author", fileName: "test.mp3" },
    { id: 91057657, name: "test 3", author: "test author", fileName: "test.mp3" },
  ])

  const createPlaylist: IPlaylistContext["createPlaylist$"] = async (options) => {
    const newData = await CreatePlaylist(options)
    updateAttribute$('id', newData.id!)
    setData(newData)
  }

  const editPlaylist: IPlaylistContext["editPlaylist$"] = async (options) => {
    const updatedData = await UpdatePlaylistData(playlistId(), options)
    setData(updatedData as unknown as editor.PlaylistMetadata)
  }

  const saveTrackItem = () => {
    return UpdatePlaylistData(playlistId(), { items: data!.items } as editor.PlaylistOptions)
  }

  const addTrack: IPlaylistContext["addTrack$"] = async (options) => {
    const itemData = await CreatePlaylistItem(playlistId(), options)
    setData("items", prev => [...prev!, itemData])
    await saveTrackItem()
  }

  let audioRef!: Ref<"audio">
  const [focusedTrack, setFocusedTrack] = createSignal<FocusedTrackData | null>(null)
  const setIsCurrentTrackPlaying = (state: boolean) => {
    setFocusedTrack(prev => ({ ...prev!, isPlaying$: state }))
  }

  const togglePlayTrack: IPlaylistContext["togglePlayTrack$"] = (data) => {
    // automatically reset the previous track
    if (focusedTrack()?.trackId$ !== data.id) {
      setIsCurrentTrackPlaying(false)
      console.log("reset previous state", data.id, focusedTrack()?.trackId$)
    }

    if (focusedTrack()?.isPlaying$) {
      setIsCurrentTrackPlaying(false)
    } else {
      setFocusedTrack({ 
        isLoading$: false, 
        isPlaying$: true, 
        trackId$: data.id,
        filename$: data.fileName
      } satisfies FocusedTrackData)
    }
  }

  const updateTrack: IPlaylistContext["updateTrack$"] = async (trackIndex, options) => {
    setData("items", trackIndex, prev => ({ ...prev, ...options }))
    await saveTrackItem()
    console.log("track updated:", options)
  }

  onMount(async () => {
    let playlistData: editor.PlaylistMetadata
    if (playlistId() === -1) {
      playlistData = await CreatePlaylist({
        title: "",
        description: ""
      } as editor.PlaylistOptions)
      updateAttribute$('id', playlistData.id!)
    } else {
      playlistData = await GetPlaylist(playlistId())
    }

    setData(playlistData)
  })

  return (
    <Context.Provider value={{
      createPlaylist$: createPlaylist,
      editPlaylist$: editPlaylist,
      data$: () => data,
      addTrack$: addTrack,
      updateTrack$: updateTrack,
      togglePlayTrack$: togglePlayTrack,
      focusedTrack$: focusedTrack,
      playlistId$: playlistId,
    }}>
      {props.children}
      <Show when={focusedTrack()}>
        <audio
          src={playlistTrackUrl(playlistId(), focusedTrack()!.filename$)}
          ref={audioRef}
        />
      </Show>
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}