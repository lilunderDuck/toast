import { ASSETS_SERVER_URL } from "~/api";

const ROOT_ROUTE = `${ASSETS_SERVER_URL}/local-assets/data/collection/playlist` as const

export function playlistIconUrl(playlistId: string, fileName?: string) {
  return `${ROOT_ROUTE}/${playlistId}/icons/${fileName ?? ""}` as const
}

export function playlistTrackUrl(playlistId: string, filename: string) {
  return `${ROOT_ROUTE}/${playlistId}/tracks/${filename}` as const
}