import { createAsync, useParams } from "@solidjs/router";
import { Playlist_get } from "~/wailsjs/go/playlist/Exports";

export default function getPlaylistData() {
  const param = useParams()
  return createAsync(() => {
    return Playlist_get(param.playlistId!)
  })
}