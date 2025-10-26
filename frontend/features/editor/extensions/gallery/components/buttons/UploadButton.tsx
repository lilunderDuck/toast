import { BsUpload } from "solid-icons/bs"
// ...
import { Button, Tooltip } from "~/components"
import { createLazyLoadedDropdownMenu } from "~/hooks"
// ...
import { useGalleryContext } from "../../provider"

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