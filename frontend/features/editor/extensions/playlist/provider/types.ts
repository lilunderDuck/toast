import type { editor } from "~/wailsjs/go/models"

export type PlaylistItemId = editor.PlaylistItemData["id"]

/**The state of the currently focused or playing track. */
export type FocusedTrackData = {
  trackId$: PlaylistItemId
  isPlaying$: boolean
  index$: number
  name$: string
}