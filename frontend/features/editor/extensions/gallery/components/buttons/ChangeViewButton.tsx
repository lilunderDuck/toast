import { BsUiChecks } from "solid-icons/bs"
// ...
import { Button, Tooltip } from "~/components"
import { useNodeState } from "~/features/editor/utils"
import { createLazyLoadedDropdownMenu } from "~/hooks"
// ...
import { useGalleryContext } from "../../provider"
import type { GalleryAttribute } from "../../extension"

export function ChangeViewButton() {
  const { data$ } = useGalleryContext()
  const { updateAttribute$ } = useNodeState<GalleryAttribute>()

  const ChangeViewDropdownMenu = createLazyLoadedDropdownMenu(
    () => import("./ChangeViewDropdownMenu"),
    () => ({
      onChange$(mode) {
        updateAttribute$('viewMode', mode)
      },
    })
  )

  return (
    <Tooltip label$="Change gallery view">
      <ChangeViewDropdownMenu.DropdownMenu$>
        <Button
          size$={ButtonSize.ICON}
          disabled={!data$()}
        >
          <BsUiChecks />
        </Button>
      </ChangeViewDropdownMenu.DropdownMenu$>
    </Tooltip>
  )
}