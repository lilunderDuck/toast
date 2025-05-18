import { BsFolderPlus, BsUpload } from "solid-icons/bs";
import { Button, ButtonSizeVariant, FlexCenterY, Tooltip } from "~/components";

import stylex from "@stylexjs/stylex"
import { createFileUpload, FileUploadType } from "~/features/file-uploads";
import { useGalleryDataContext } from "../data";

const style = stylex.create({
  buttonRow: {
    gap: 10
  }
})

export function GalleryButtonRow() {
  const { addImages$ } = useGalleryDataContext()
  const fileUpload = createFileUpload({
    type$: FileUploadType.file,
    title$: "Please select a file",
    async onFinish$(filePath) {
      await addImages$(filePath)
    },
  })

  const directoryUpload = createFileUpload({
    type$: FileUploadType.file,
    title$: "Please select a file",
    async onFinish$(filePath) {
      await addImages$(filePath)
    },
  })

  const shouldDisableButtons = () => directoryUpload.isUploading$() || fileUpload.isUploading$()

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
    </FlexCenterY>
  )
}