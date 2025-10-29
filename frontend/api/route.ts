export const ASSETS_SERVER_URL = "http://localhost:8000"
export const PREVIEW_FILE_URL = `${ASSETS_SERVER_URL}/preview?file=`

export function playlistTrackUrl(playlistId: string, filename: string) {
  return `${ASSETS_SERVER_URL}/local-assets/data/playlist/${playlistId}/${filename}` as const
}

export function previewUrl(filePath: string) {
  return `${ASSETS_SERVER_URL}/preview?path=${encodeURIComponent(filePath)}` as const
}