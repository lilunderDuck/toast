import { BsThreeDots } from "solid-icons/bs"
import { Button } from "~/components"
import { createLazyLoadedDropdownMenu } from "~/hooks"
import { usePlaylistContext } from "../provider"

interface IPlaylistHeaderDropdownButtonProps {
  // define your component props here
}

export function PlaylistHeaderDropdownButton(props: IPlaylistHeaderDropdownButtonProps) {
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
      <Button
        size$={ButtonSize.ICON}
        variant$={ButtonVariant.NO_BACKGROUND}
      >
        <BsThreeDots />
      </Button>
    </TableMoreOptionsDropdownMenu.DropdownMenu$>
  )
}