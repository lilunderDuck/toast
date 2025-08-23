import { createLazyLoadedDialog, DropdownMenuContent, DropdownMenuItem, IDropdownMenu } from "~/components"
import { createFileUpload, FileUploadType } from "~/features/native"
import { useGalleryContext } from "../../provider"

interface IUploadDropdownMenu extends IDropdownMenu {
  // ...
}

export default function UploadDropdownMenu(props: IUploadDropdownMenu) {
  const { uploadOneFile$ } = useGalleryContext()
  const GalleryDirectoryUploadDialog = createLazyLoadedDialog(
    () => import("../dialog/GalleryDirectoryUploadDialog")
  )

  const { open$ } = createFileUpload({
    type$: FileUploadType.file,
    dialogOptions$: {
      Title: "Please select your file."
    },
    async onFinish$(filePath) {
      await uploadOneFile$(filePath)
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
      <GalleryDirectoryUploadDialog.Modal$ />
    </>
  )
}