import { type Accessor, createContext, createSignal, onMount, type ParentProps, type Setter, Show, useContext } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { useNodeState } from "~/features/editor/utils"
import { CreatePlaylist, UpdatePlaylistData, CreatePlaylistItem, GetPlaylist } from "~/wailsjs/go/editor/EditorExport"
import type { editor } from "~/wailsjs/go/models"
import { playlistTrackUrl } from "~/api"
import { arrayObjects } from "~/utils"
// ...
import type { PlaylistAttribute } from "../extension"

/**Managing tracks within a playlist. */
export interface IPlaylistTrackItem {
  /**The list of track items in the playlist. */
  items$: Accessor<editor.PlaylistItemData[]>
  /**The setter function for updating the track items. */
  setItems$: Setter<editor.PlaylistItemData[]>
  /**Adds a new track to the playlist.
   * @param options The options for creating the new playlist item.
   */
  add$(options: editor.CreatePlaylistItemOptions): Promise<void>
  /**Updates an existing track in the playlist.
   * @param trackId The ID of the track to update.
   * @param options The new data for the playlist item.
   */
  update$(trackId: number, options: editor.EditPlaylistItemOptions): Promise<void>
  /**Deletes a track from the playlist.
   * @param trackId The ID of the track to delete.
   */
  delete$(trackId: number): Promise<void>
  /**Toggles the playback state of a specific track. If the user plays another track, 
   * the previous track will be paused and the selected track will be played.
   * @param data The data of the track to play or pause.
   */
  togglePlayTrack$(data: editor.PlaylistItemData): void
  /**The accessor for the currently focused/playing track. */
  focusedTrack$: Accessor<FocusedTrackData | null>
}

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

/**A type definition for the state of the currently focused or playing track. */
export type FocusedTrackData = {
  /**The track id of the focused track. */
  trackId$: number
  /**The playback state of the track. */
  isPlaying$: boolean
  /**The filename of the focused track. */
  filename$: string
}

const Context = createContext<IPlaylistContext>()

export function PlaylistProvider(props: ParentProps) {
  const [data, setData] = createStore() as SolidStore<editor.PlaylistMetadata | undefined>

  const { updateAttribute$, data$ } = useNodeState<PlaylistAttribute>()
  const playlistId = () => data$().id

  const editPlaylist: IPlaylistContext["editPlaylist$"] = async (options) => {
    const updatedData = await UpdatePlaylistData(playlistId(), options)
    setData(updatedData as unknown as editor.PlaylistMetadata)
  }

  // It's quite a headache because we have 2 state, one for the playlist metadata
  // and another for storing track items. This is because I want to add drag and drop as well.
  // 
  // And solid's createStore() is hell-ta confusing.
  const [trackItems, setTrackItems] = createSignal<editor.PlaylistItemData[]>([])

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
    setTrackItems(playlistData.items)
  })

  const saveTrackItem = () => {
    return UpdatePlaylistData(playlistId(), { items: trackItems() } as editor.PlaylistOptions)
  }

  const addTrack: IPlaylistTrackItem["add$"] = async (options) => {
    const itemData = await CreatePlaylistItem(playlistId(), options)
    setTrackItems(prev => [...prev, itemData])
    await saveTrackItem()
  }

  let audioRef!: Ref<"audio">
  const [focusedTrack, setFocusedTrack] = createSignal<FocusedTrackData | null>(null)
  const setIsCurrentTrackPlaying = (state: boolean) => {
    setFocusedTrack(prev => ({ ...prev!, isPlaying$: state }))
  }

  const togglePlayTrack: IPlaylistTrackItem["togglePlayTrack$"] = (data) => {
    // automatically reset the previous track
    if (focusedTrack()?.trackId$ !== data.id) {
      setIsCurrentTrackPlaying(false)
      console.log("reset previous state", data.id, focusedTrack()?.trackId$)
    }

    // then do whatever with the current track
    if (focusedTrack()?.isPlaying$) {
      setIsCurrentTrackPlaying(false)
      audioRef.pause()
    } else {
      setFocusedTrack({ 
        isPlaying$: true, 
        trackId$: data.id,
        filename$: data.fileName
      } satisfies FocusedTrackData)
      audioRef.play()
    }
  }

  const updateTrack: IPlaylistTrackItem["update$"] = async (trackId, options) => {
    setTrackItems(prev => [...arrayObjects(prev).replace$(it => it.id === trackId, options)])
    await saveTrackItem()
  }

  const deleteTrack: IPlaylistTrackItem["delete$"] = async(trackId) => {
    setTrackItems(prev => [...arrayObjects(prev).remove$('id', trackId)])
    await saveTrackItem()
  }

  const audioFinishedPlaying: EventHandler<"audio", "onEnded"> = () => {
    const [, index] = arrayObjects(trackItems()).find$(it => it.id === focusedTrack()?.trackId$)
    if (index === -1) {
      return // stop autoplay
    }

    const nextTrackData = trackItems()[index + 1]
    togglePlayTrack(nextTrackData)
  }

  return (
    <Context.Provider value={{
      editPlaylist$: editPlaylist,
      data$: () => data,
      trackItems$: {
        focusedTrack$: focusedTrack,
        add$: addTrack,
        togglePlayTrack$: togglePlayTrack,
        update$: updateTrack,
        items$: trackItems,
        setItems$: setTrackItems,
        delete$: deleteTrack
      },
      playlistId$: playlistId,
    }}>
      {props.children}
      <Show when={focusedTrack()}>
        <audio
          src={playlistTrackUrl(playlistId(), focusedTrack()!.filename$)}
          onEnded={audioFinishedPlaying}
          ref={audioRef}
        />
      </Show>
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}