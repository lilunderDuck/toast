import { ASSETS_SERVER_URL } from "~/api";

export function playlistIconUrl(playlistId: number, fileName: string) {
  return `${ASSETS_SERVER_URL}/local-assets/data/playlist/${playlistId}/icons/${fileName}` as const
}

export function playlistTrackUrl(playlistId: number, filename: string) {
  return `${ASSETS_SERVER_URL}/local-assets/data/playlist/${playlistId}/tracks/${filename}` as const
}