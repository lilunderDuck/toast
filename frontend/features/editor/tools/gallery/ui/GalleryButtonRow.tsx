import { BsApp, BsFolderPlus, BsUpload } from "solid-icons/bs";
import { Button, ButtonSizeVariant, createLazyLoadedDialog, FlexCenterY, Spacer, Tooltip } from "~/components";

import stylex from "@stylexjs/stylex"
import { createFileUpload, FileUploadType } from "~/features/file-uploads";
import { useGalleryDataContext } from "../data";

const style = stylex.create({
  buttonRow: {
    gap: 10
  }
})

export function GalleryButtonRow() {
  const { addGalleryItem$ } = useGalleryDataContext()
  const fileUpload = createFileUpload({
    type$: FileUploadType.file,
    title$: "Please select a file",
    async onFinish$(filePath) {
      await addGalleryItem$(filePath)
    },
  })

  const directoryUpload = createFileUpload({
    type$: FileUploadType.file,
    title$: "Please select a file",
    async onFinish$(filePath) {
      await addGalleryItem$(filePath)
    },
  })

  const shouldDisableButtons = () => directoryUpload.isUploading$() || fileUpload.isUploading$()

  const GalleryFullViewDialog = createLazyLoadedDialog(
    () => import("../dialog/GalleryFullViewDialog"),
    () => {
      return {
        context: useGalleryDataContext()
      }
    }
  )

  return (
    <FlexCenterY {...stylex.attrs(style.buttonRow)}>
      <Tooltip label$="Select a file">
        <fileUpload.FileUploadZone$>
          <Button size$={ButtonSizeVariant.icon} disabled={shouldDisableButtons()}>
            <BsUpload />
          </Button>
        </fileUpload.FileUploadZone$>
      </Tooltip>
      <Tooltip label$="Select a folder">
        <directoryUpload.FileUploadZone$>
          <Button size$={ButtonSizeVariant.icon} disabled={shouldDisableButtons()}>
            <BsFolderPlus />
          </Button>
        </directoryUpload.FileUploadZone$>
      </Tooltip>
      <Spacer />
      <Tooltip label$="Open in full view">
        <Button 
          size$={ButtonSizeVariant.icon} 
          disabled={shouldDisableButtons()} 
          onClick={GalleryFullViewDialog.show$}
        >
          <BsApp />
        </Button>
      </Tooltip>

      <GalleryFullViewDialog.Modal$ />
    </FlexCenterY>
  )
}