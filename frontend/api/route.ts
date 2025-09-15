export const ASSETS_SERVER_URL = "http://localhost:8000"
export const PREVIEW_FILE_URL = `${ASSETS_SERVER_URL}/preview?file=`

export function escapeCssUrl<const T extends string>(anyUrl: T) {
  return `url('${encodeURIComponent(anyUrl)}')` as const
}

export function playlistTrackUrl(playlistId: number, filename: string) {
  return `${ASSETS_SERVER_URL}/local-assets/playlist/${playlistId}/audio/${filename}` as const
}

export function previewUrl(filePath: string) {
  return `${ASSETS_SERVER_URL}/preview?path=${encodeURIComponent(filePath)}` as const
}