import { ASSETS_SERVER_URL } from "~/api";

const ROOT_ROUTE = `${ASSETS_SERVER_URL}/local-assets/data/collection/playlist` as const

export function playlistIconUrl(playlistId: number, fileName: string) {
  return `${ROOT_ROUTE}/${playlistId}/icons/${fileName}` as const
}

export function playlistTrackUrl(playlistId: number, filename: string) {
  return `${ROOT_ROUTE}/${playlistId}/tracks/${filename}` as const
}