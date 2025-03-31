import { createDropzone } from "@soorria/solid-dropzone"
import { Show } from "solid-js"
import { BsFullscreen } from "solid-icons/bs"
// ...
import { api_saveGalleryImage } from "~/api/media"
import { Button, ButtonSizeVariant, createLazyLoadedDialog, Tooltip } from "~/components"
import { useJournalContext } from "~/features/journal"
import { useResource } from "~/hook"
import { useEditorContext } from "~/features/editor"
// ...
import GalleryList from "./GalleryList"
import { useGalleryDataContext } from "../data"
import GalleryButtonRow from "./GalleryButtonRow"

export function GallerySideView() {
  const { getCurrentGroup$ } = useJournalContext()
  const { galleryId$, addImages$ } = useGalleryDataContext()
  const { isReadonly$ } = useEditorContext()

  const { fetch$, isLoading$ } = useResource(async(targetFile: File[]) => {
    const currentGroupId = getCurrentGroup$().id
    const fileNames = []
    for (const file of targetFile) {
      const newFileName = await api_saveGalleryImage(currentGroupId, galleryId$, file)
      fileNames.push(newFileName)
    }

    addImages$(fileNames)
  })

  const dropzone = createDropzone({
    accept: ['.jpg', '.png'],
    async onDrop(acceptedFiles: File[]) {
      await fetch$(acceptedFiles)
    }
  })

  const getGalleryListProps = () => isReadonly$() ? {} : dropzone.getRootProps()
  const galleryDialog = createLazyLoadedDialog(
    () => import("./dialog/GalleryDialog")
  )
  
  return (
    <div id={`gallery-${galleryId$}`}>
      <GalleryList {...getGalleryListProps()} />
      <GalleryButtonRow>
        <Tooltip label$="Open in full view">
          <Button size$={ButtonSizeVariant.icon} onClick={() => galleryDialog.show$()}>
            <BsFullscreen />
          </Button>
        </Tooltip>
        <Show when={isLoading$()}>
          <div>Loading...</div>
        </Show>
      </GalleryButtonRow>
      <galleryDialog.Modal$ />
    </div>
  )
}