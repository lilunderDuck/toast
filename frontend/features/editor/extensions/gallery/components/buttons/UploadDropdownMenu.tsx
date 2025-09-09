import { createLazyLoadedDialog, DropdownMenuContent, DropdownMenuItem, type IDropdownMenu } from "~/components"
import { createFileUpload } from "~/features/native"
import { useGalleryContext } from "../../provider"

interface IUploadDropdownMenu extends IDropdownMenu {
  // ...
}

export default function UploadDropdownMenu(props: IUploadDropdownMenu) {
  const { uploadFileToGallery$ } = useGalleryContext()
  const GalleryDirectoryUploadDialog = createLazyLoadedDialog(
    () => import("../dialog/GalleryDirectoryUploadDialog")
  )

  const { open$ } = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      Title: "Please select your file."
    },
    async onFinish$(filePath) {
      await uploadFileToGallery$(filePath)
    },
  })
  
  return (
    <>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={open$}>
          <span>Upload single file.</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={GalleryDirectoryUploadDialog.show$}>
          <span>Upload multiple file in a directory.</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <GalleryDirectoryUploadDialog.Dialog$ />
    </>
  )
}