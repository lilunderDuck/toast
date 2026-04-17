import { createAsync, useParams } from "@solidjs/router";
import { GetPlaylistData } from "~/wailsjs/go/playlist/Exports";

export default function getPlaylistData() {
  const param = useParams()
  const playlistId = parseInt(param.playlistId!)
  return createAsync(() => {
    return GetPlaylistData(playlistId)
  })
}