import type { ToastPromiseMessages } from "~/libs/solid-toast/core";
import type { playlist } from "~/wailsjs/go/models";

export const playlistDurationResyncToast: ToastPromiseMessages<playlist.UpdatedPlaylist> = {
  loading: <>Syncing tracks duration. This might take time...</>,
  error: () => <>Failed to sync tracks duration</>,
  success: () => <>Successfully synced all tracks duration.</>
}