import { createAsync, useParams } from "@solidjs/router"
// ...
import { COLLECTION_TYPE_MAGIC_ROUTE_NAME_REGISTRY } from "~/api"
import { Gallery_getByPath } from "~/wailsjs/go/gallery/Exports"

export default function getPlaylistData() {
  const param = useParams()
  return createAsync(() => {
    const currentGalleryId = param.galleryId
    if (currentGalleryId === COLLECTION_TYPE_MAGIC_ROUTE_NAME_REGISTRY[CollectionType.GALLERY]) {
      Gallery_getByPath
    }

    throw new Error("Panic: not implemented")
  })
}