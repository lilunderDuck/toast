export const ASSETS_SERVER_URL = "http://localhost:8000"

export function previewUrl<const T extends string>(filePath: T) {
  return `${ASSETS_SERVER_URL}/preview?path=${encodeURIComponent(filePath) as T}` as const
}