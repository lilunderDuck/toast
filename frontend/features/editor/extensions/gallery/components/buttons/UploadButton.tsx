import { Button, createLazyLoadedDropdownMenu, Tooltip } from "~/components"
import { useGalleryContext } from "../../provider"
import { BsUpload } from "solid-icons/bs"

export function UploadButton() {
  const { data$ } = useGalleryContext()
  const UploadDropdownMenu = createLazyLoadedDropdownMenu(
    () => import("./UploadDropdownMenu"),
  )

  return (
    <Tooltip label$="Upload media">
      <UploadDropdownMenu.DropdownMenu$>
        <Button
          size$={ButtonSize.ICON}
          disabled={!data$()}
        >
          <BsUpload />
        </Button>
      </UploadDropdownMenu.DropdownMenu$>
    </Tooltip>
  )
}