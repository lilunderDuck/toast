import { ASSETS_SERVER_URL, previewUrl } from "~/api"

const ROOT_ROUTE = `${ASSETS_SERVER_URL}/local-assets/data/collections/gallery` as const

export function getGalleryIconUrl(fileName: string) {
  return `${ROOT_ROUTE}/icons/${fileName}` as const
}

export function getExternalGalleryIconUrl(filePath: string, fileName?: string) {
  return previewUrl(`${filePath}/icons/${fileName ?? ""}` as const)
}

export function getGalleryEntryUrl(fileName: string) {
  return `${ROOT_ROUTE}/entry/${fileName}` as const
}

export function getExternalGalleryEntryUrl(filePath: string, fileName?: string) {
  return previewUrl(`${filePath}/entry/${fileName ?? ""}` as const)
}