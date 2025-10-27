import { createEffect, createSignal, type Accessor, type Setter } from "solid-js"
import type { playlist as Playlist } from "~/wailsjs/go/models"
import { CreatePlaylistItem, UpdatePlaylist } from "~/wailsjs/go/playlist/Exports"
import { arrayObjects } from "~/utils"

/**Managing tracks within a playlist. */
export interface IPlaylistTrackItem {
  /**The list of track items in the playlist. */
  items$: Accessor<Playlist.PlaylistItemData[]>
  /**The setter function for updating the track items. */
  setItems$: Setter<Playlist.PlaylistItemData[]>
  /**Adds a new track to the playlist.
   * @param options The options for creating the new playlist item.
   */
  add$(options: Playlist.PlaylistItemOptions): Promise<void>
  /**Updates an existing track in the playlist.
   * @param trackId The ID of the track to update.
   * @param options The new data for the playlist item.
   */
  update$(trackId: number, options: Playlist.PlaylistItemOptions): Promise<void>
  /**Deletes a track from the playlist.
   * @param trackId The ID of the track to delete.
   */
  delete$(trackId: number): Promise<void>
}

export function createTrackItemsManager(playlistId: () => number): IPlaylistTrackItem {
  // It's quite a headache because we have 2 state, one for the playlist metadata
  // and another for storing track items. This is because I want to add drag and drop as well.
  // 
  // And solid's createStore() is hell-ta confusing.
  const [trackItems, setTrackItems] = createSignal<Playlist.PlaylistItemData[]>([])
  
  createEffect(() => console.log(trackItems()))

  const saveTrackItem = () => {
    return UpdatePlaylist(playlistId(), { items: trackItems() } as Playlist.PlaylistOptions)
  }

  const addTrack: IPlaylistTrackItem["add$"] = async (options) => {
    const itemData = await CreatePlaylistItem(playlistId(), options)
    setTrackItems(prev => [...prev, itemData])
    await saveTrackItem()
  }

  const updateTrack: IPlaylistTrackItem["update$"] = async (trackId, options) => {
    setTrackItems(prev => [...arrayObjects(prev).replace$(it => it.id === trackId, options)])
    await saveTrackItem()
  }

  const deleteTrack: IPlaylistTrackItem["delete$"] = async (trackId) => {
    setTrackItems(prev => [...arrayObjects(prev).remove$('id', trackId)])
    await saveTrackItem()
  }

  return {
    add$: addTrack,
    delete$: deleteTrack,
    items$: trackItems,
    setItems$: setTrackItems,
    update$: updateTrack,
  }
}