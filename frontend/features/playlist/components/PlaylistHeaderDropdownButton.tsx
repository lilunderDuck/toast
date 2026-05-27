import { BsThreeDots } from "solid-icons/bs"
// ...
import { Button, Tooltip } from "~/components"
import { createLazyLoadedDropdownMenu } from "~/hooks"
// ...
import { usePlaylistContext } from "../provider"

export function PlaylistHeaderDropdownButton() {
  const { resyncTracksDuration$ } = usePlaylistContext()
  
  const TableMoreOptionsDropdownMenu = createLazyLoadedDropdownMenu(
    () => import("./dropdown/PlaylistHeaderMoreOptionDropdown"),
    () => ({
      action$(type) {
        switch (type) {
          case "resyncDuration$":
            resyncTracksDuration$()
          break;
        
          default:
            console.log("case", type, "have not been handled yet.")
            break;
        }
      },
    })
  )

  return (
    <TableMoreOptionsDropdownMenu.DropdownMenu$>
      <Tooltip label$="More options">
        <Button
          size$={ButtonSize.ICON}
          variant$={ButtonVariant.NO_BACKGROUND}
        >
          <BsThreeDots />
        </Button>
      </Tooltip>
    </TableMoreOptionsDropdownMenu.DropdownMenu$>
  )
}