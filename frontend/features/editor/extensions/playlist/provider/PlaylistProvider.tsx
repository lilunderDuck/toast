import { createContext, onMount, type ParentProps, useContext } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { CreatePlaylist, UpdatePlaylist, GetPlaylist } from "~/wailsjs/go/editor/Exports"
import type { editor } from "~/wailsjs/go/models"
import { createOrGetData } from "~/features/editor/utils"
import { createMediaPlayer } from "~/hooks"
import { useSolidNodeView } from "~/libs/solid-tiptap-renderer"
// ...
import type { PlaylistAttribute } from "../extension"
import { createTrackItemsManager, type IPlaylistTrackItem } from "./items"
import { createTrackPlayerManager } from "./track"

export interface IPlaylistContext {
  /**The playlist's metadata. */
  attrs$: () => editor.PlaylistMetadata | undefined
  /**Edits an existing playlist's metadata.
   * @param options The new metadata for the playlist.
   */
  editPlaylist$(options: editor.PlaylistOptions): Promise<void>
  /**Gets the playlist's ID. */
  playlistId$(): string
  /**Managing tracks within the playlist. */
  items$: IPlaylistTrackItem
  track$: ReturnType<typeof createTrackPlayerManager>
}

const Context = createContext<IPlaylistContext>()

export function PlaylistProvider(props: ParentProps) {
  const [data, setData] = createStore() as SolidStore<editor.PlaylistMetadata | undefined>

  const { attrs$ } = useSolidNodeView<PlaylistAttribute>()
  const playlistId = () => attrs$().id

  const editPlaylist: IPlaylistContext["editPlaylist$"] = async (options) => {
    const updatedData = await UpdatePlaylist(playlistId(), options)
    setData(updatedData as unknown as editor.PlaylistMetadata)
  }

  const trackItems = createTrackItemsManager(playlistId)
  let playlistData: editor.PlaylistMetadata

  // Initializes the playlist data on component mount, creating a new one if necessary.
  onMount(async () => {
    const data = await createOrGetData<editor.PlaylistMetadata>(
      playlistId() === PLAYLIST_DEFAULT_ID,
      () => CreatePlaylist({
        title: "Unnamed playlist",
        description: ""
      } as editor.PlaylistOptions),
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
      attrs$: () => data,
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