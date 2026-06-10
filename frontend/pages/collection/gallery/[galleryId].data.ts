import { createAsync, useParams } from "@solidjs/router";
import { GALLERY_IN_EXTERNAL_MODE } from "~/features/gallery";
import { Gallery_getByPath } from "~/wailsjs/go/gallery/Exports";

export default function getPlaylistData() {
  const param = useParams()
  return createAsync(() => {
    const currentGalleryId = param.galleryId
    if (currentGalleryId === GALLERY_IN_EXTERNAL_MODE) {
      Gallery_getByPath
    }

    throw new Error("Panic: not implemented")
  })
}