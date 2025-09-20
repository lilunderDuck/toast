import { createEffect, createSignal, type Accessor, type Setter } from "solid-js";
import type { editor } from "~/wailsjs/go/models";
import { CreatePlaylistItem, UpdatePlaylist } from "~/wailsjs/go/editor/EditorExport";
import { arrayObjects } from "~/utils";

/**A type definition for the state of the currently focused or playing track. */
export type FocusedTrackData = {
  /**The track id of the focused track. */
  trackId$: number
  /**The playback state of the track. */
  isPlaying$: boolean
  /**The filename of the focused track. */
  filename$: string
}

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
  audioFinishedPlaying$: EventHandler<"audio", "onEnded">
}

export function createTrackItemsManager(playlistId: () => number, audioRef: () => Ref<"audio">): IPlaylistTrackItem {
  // It's quite a headache because we have 2 state, one for the playlist metadata
  // and another for storing track items. This is because I want to add drag and drop as well.
  // 
  // And solid's createStore() is hell-ta confusing.
  const [trackItems, setTrackItems] = createSignal<editor.PlaylistItemData[]>([])

  createEffect(() => console.log(trackItems()))

  const saveTrackItem = () => {
    return UpdatePlaylist(playlistId(), { items: trackItems() } as editor.PlaylistOptions)
  }

  const addTrack: IPlaylistTrackItem["add$"] = async (options) => {
    const itemData = await CreatePlaylistItem(playlistId(), options)
    setTrackItems(prev => [...prev, itemData])
    await saveTrackItem()
  }

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
      audioRef().pause()
    } else {
      setFocusedTrack({
        isPlaying$: true,
        trackId$: data.id,
        filename$: data.fileName
      } satisfies FocusedTrackData)
      audioRef().play()
    }
  }

  const updateTrack: IPlaylistTrackItem["update$"] = async (trackId, options) => {
    setTrackItems(prev => [...arrayObjects(prev).replace$(it => it.id === trackId, options)])
    await saveTrackItem()
  }

  const deleteTrack: IPlaylistTrackItem["delete$"] = async (trackId) => {
    setTrackItems(prev => [...arrayObjects(prev).remove$('id', trackId)])
    await saveTrackItem()
  }

  const audioFinishedPlaying: EventHandler<"audio", "onEnded"> = () => {
    const [prevTrackData, index] = arrayObjects(trackItems()).find$(it => it?.id === focusedTrack()?.trackId$)
    if (index === -1) {
      return // stop autoplay
    }

    const nextTrackData = trackItems()[index + 1]
    if (!nextTrackData) {
      togglePlayTrack(prevTrackData)
      setFocusedTrack(null)
      return
    }
    togglePlayTrack(nextTrackData)
  }

  return {
    add$: addTrack,
    delete$: deleteTrack,
    focusedTrack$: focusedTrack,
    items$: trackItems,
    setItems$: setTrackItems,
    togglePlayTrack$: togglePlayTrack,
    update$: updateTrack,
    audioFinishedPlaying$: audioFinishedPlaying
  }
}