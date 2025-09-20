import { createContext, onMount, type ParentProps, Show, useContext } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { useNodeState } from "~/features/editor/utils"
import { CreatePlaylist, UpdatePlaylist, GetPlaylist } from "~/wailsjs/go/editor/EditorExport"
import type { editor } from "~/wailsjs/go/models"
import { playlistTrackUrl } from "~/api"
// ...
import type { PlaylistAttribute } from "../extension"
import { createTrackItemsManager, type IPlaylistTrackItem } from "./items"

export interface IPlaylistContext {
  /**The playlist's metadata. */
  data$: () => editor.PlaylistMetadata | undefined
  /**Edits an existing playlist's metadata.
   * @param options The new metadata for the playlist.
   */
  editPlaylist$(options: editor.PlaylistOptions): Promise<void>
  /**Gets the playlist's ID. */
  playlistId$(): number
  /**Managing tracks within the playlist. */
  trackItems$: IPlaylistTrackItem
}

const Context = createContext<IPlaylistContext>()

export function PlaylistProvider(props: ParentProps) {
  const [data, setData] = createStore() as SolidStore<editor.PlaylistMetadata | undefined>

  const { updateAttribute$, data$ } = useNodeState<PlaylistAttribute>()
  const playlistId = () => data$().id

  const editPlaylist: IPlaylistContext["editPlaylist$"] = async (options) => {
    const updatedData = await UpdatePlaylist(playlistId(), options)
    setData(updatedData as unknown as editor.PlaylistMetadata)
  }

  let audioRef!: Ref<"audio">
  const trackItemsManager = createTrackItemsManager(playlistId, () => audioRef)

  // Initializes the playlist data on component mount, creating a new one if necessary.
  onMount(async () => {
    let playlistData: editor.PlaylistMetadata
    if (playlistId() === -1) {
      playlistData = await CreatePlaylist({
        title: "Unnamed playlist",
        description: ""
      } as editor.PlaylistOptions)
      updateAttribute$('id', playlistData.id!)
    } else {
      playlistData = await GetPlaylist(playlistId())
    }

    setData(playlistData)
    trackItemsManager.setItems$(playlistData.items ?? [])
  })

  return (
    <Context.Provider value={{
      editPlaylist$: editPlaylist,
      data$: () => data,
      trackItems$: trackItemsManager,
      playlistId$: playlistId,
    }}>
      {props.children}
      <Show when={trackItemsManager.focusedTrack$()}>
        <audio
          src={playlistTrackUrl(playlistId(), trackItemsManager.focusedTrack$()!.filename$)}
          onEnded={trackItemsManager.audioFinishedPlaying$}
          ref={audioRef}
        />
      </Show>
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}