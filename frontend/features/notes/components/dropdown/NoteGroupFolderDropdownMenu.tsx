import { BsImageAlt } from "solid-icons/bs"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuItemIcon } from "~/components"
import { createLazyComponent, type IBaseLazyComponent } from "~/hooks"

interface INoteGroupFolderDropdownMenuProps extends IBaseLazyComponent {
  imageSrc$?: string
}

export default function NoteGroupFolderDropdownMenu(props: INoteGroupFolderDropdownMenuProps) {
  const ImageFullviewDialogContent = createLazyComponent(
    LazyComponentType.DIALOG,
    () => import("~/components/dialog/ImageFullviewDialogContent"),
    () => ({
      imageSrc$: props.imageSrc$!
    })
  )

  return (
    <>
      <DropdownMenuContent>
        <DropdownMenuItem 
          disabled={props.imageSrc$ === undefined} 
          onClick={ImageFullviewDialogContent.show$}
        >
          <DropdownMenuItemIcon>
            <BsImageAlt />
          </DropdownMenuItemIcon>
          See cover image
        </DropdownMenuItem>
      </DropdownMenuContent>
      <ImageFullviewDialogContent.Component$ />
    </>
  )
}