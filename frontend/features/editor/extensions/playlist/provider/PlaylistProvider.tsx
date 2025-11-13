import { createContext, onMount, type ParentProps, useContext } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { createOrGetData, useNodeState } from "~/features/editor/utils"
import { CreatePlaylist, UpdatePlaylist, GetPlaylist } from "~/wailsjs/go/playlist/Exports"
import type { playlist } from "~/wailsjs/go/models"
// ...
import type { PlaylistAttribute } from "../extension"
import { createTrackItemsManager, type IPlaylistTrackItem } from "./items"
import { createTrackPlayerManager } from "./track"
import { createMediaPlayer } from "~/hooks"

export interface IPlaylistContext {
  /**The playlist's metadata. */
  data$: () => playlist.PlaylistMetadata | undefined
  /**Edits an existing playlist's metadata.
   * @param options The new metadata for the playlist.
   */
  editPlaylist$(options: playlist.PlaylistOptions): Promise<void>
  /**Gets the playlist's ID. */
  playlistId$(): number
  /**Managing tracks within the playlist. */
  items$: IPlaylistTrackItem
  track$: ReturnType<typeof createTrackPlayerManager>
}

const Context = createContext<IPlaylistContext>()

export function PlaylistProvider(props: ParentProps) {
  const [data, setData] = createStore() as SolidStore<playlist.PlaylistMetadata | undefined>

  const { data$ } = useNodeState<PlaylistAttribute>()
  const playlistId = () => data$().id

  const editPlaylist: IPlaylistContext["editPlaylist$"] = async (options) => {
    const updatedData = await UpdatePlaylist(playlistId(), options)
    setData(updatedData as unknown as playlist.PlaylistMetadata)
  }

  const trackItems = createTrackItemsManager(playlistId)
  let playlistData: playlist.PlaylistMetadata

  // Initializes the playlist data on component mount, creating a new one if necessary.
  onMount(async () => {
    const data = await createOrGetData<playlist.PlaylistMetadata>(
      playlistId() === -1,
      () => CreatePlaylist({
        title: "Unnamed playlist",
        description: ""
      } as playlist.PlaylistOptions),
      () => GetPlaylist(playlistId())
    )

    setData(data)
    trackItems.setItems$(data.items ?? [])
    playlistData = data
  })

  const player = createMediaPlayer("audio")
  const trackPlayer = createTrackPlayerManager(player, () => playlistData)

  return (
    <Context.Provider value={{
      editPlaylist$: editPlaylist,
      data$: () => data,
      items$: trackItems,
      track$: trackPlayer,
      playlistId$: playlistId,
    }}>
      {props.children}
      <player.Player$ />
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}