import { DropdownMenuContent, DropdownMenuItem, Tooltip } from "~/components";
import { OcIssuetracks2 } from "solid-icons/oc"
import type { IBaseDropdownMenu } from "~/hooks";
import { createSignal } from "solid-js";

type Action = "resyncDuration$"
interface IPlaylistHeaderMoreOptionDropdownProps extends IBaseDropdownMenu, IActionHandler<Action> {
  // define your component props here
}

export default function PlaylistHeaderMoreOptionDropdown(props: IPlaylistHeaderMoreOptionDropdownProps) {
  const [disableResyncDurationItem, setDisableResyncDurationItem] = createSignal(false)
  const resyncDuration = async() => {
    setDisableResyncDurationItem(true)
    await props.action$("resyncDuration$")
    setDisableResyncDurationItem(false)
  }

  return (
    <DropdownMenuContent>
      <DropdownMenuItem 
        onClick={resyncDuration}
        disabled={disableResyncDurationItem()}
      >
        <OcIssuetracks2 />
        <span>Resync all tracks duration</span>
      </DropdownMenuItem>
      <Tooltip label$={(
        <>
          If your track is somehow being cut off,
          click here to fix it.
        </>
      )}>
        <DropdownMenuItem onClick={() => {}}>
          <OcIssuetracks2 />
          <span>Fix track VBR header</span>
        </DropdownMenuItem>
      </Tooltip>
    </DropdownMenuContent>
  )
}