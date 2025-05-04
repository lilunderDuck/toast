import { Show } from "solid-js"
import { BsFullscreen } from "solid-icons/bs"
// ...
import { api_saveGalleryImage } from "~/api/media"
import { Button, ButtonSizeVariant, createLazyLoadedDialog, Tooltip } from "~/components"
import { useJournalContext } from "~/features/journal"
import { useEditorContext } from "~/features/editor"
// ...
import GalleryList from "./GalleryList"
import { useGalleryDataContext } from "../data"
import GalleryButtonRow from "./GalleryButtonRow"
import { createFileUpload, FileUploadType } from "~/features/file-uploads"

export function GallerySideView() {
  const { getCurrentGroup$ } = useJournalContext()
  const { galleryId$, addImages$ } = useGalleryDataContext()
  const { isReadonly$ } = useEditorContext()

  const { FileUploadZone$, isUploading$, error$ } = createFileUpload({
    title$: "Please choose a file.",
    type$: FileUploadType.multiFile,
    filter$() {
      return [
        // { name: "" }
      ]
    },
    async onFinish$(filePath) {
      const currentGroupId = getCurrentGroup$().id
      const newFileNames: string[] = []

      for (const path of filePath) {
        newFileNames.push((await api_saveGalleryImage(currentGroupId, galleryId$, path)).result)
      }

      addImages$(newFileNames)
    }
  })

  const galleryDialog = createLazyLoadedDialog(
    () => import("./dialog/GalleryDialog")
  )

  return (
    <div id={`gallery-${galleryId$}`}>
      <Show when={!isReadonly$()} fallback={
        <GalleryList />
      }>
        <FileUploadZone$>
          <GalleryList />
        </FileUploadZone$>
      </Show>
      <GalleryButtonRow>
        <Tooltip label$="Open in full view">
          <Button size$={ButtonSizeVariant.icon} onClick={() => galleryDialog.show$()}>
            <BsFullscreen />
          </Button>
        </Tooltip>
        <Show when={isUploading$() && !error$()}>
          <div>Loading...</div>
        </Show>
        <Show when={error$()}>
          <div>Failed to upload.</div>
        </Show>
      </GalleryButtonRow>
      <galleryDialog.Modal$ />
    </div>
  )
}
