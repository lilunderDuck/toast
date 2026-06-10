import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, Spacer, Tooltip } from "~/components";
import { OcIssuetracks2 } from "solid-icons/oc"
import { createSignal } from "solid-js";
import { BsImageFill, BsQuestionCircleFill } from "solid-icons/bs";
// ...
import type { IBaseDropdownMenu } from "~/hooks";
import type { IActionHandler } from "~/utils";

interface IPlaylistHeaderMoreOptionDropdownProps extends IBaseDropdownMenu, IActionHandler<PlaylistHeaderDropdownAction> {
  disableViewBackgroundButton$: boolean
}

export default function PlaylistHeaderMoreOptionDropdown(props: IPlaylistHeaderMoreOptionDropdownProps) {
  const [disableResyncDurationItem, setDisableResyncDurationItem] = createSignal(false)
  const resyncDuration = async () => {
    setDisableResyncDurationItem(true)
    await props.action$(PlaylistHeaderDropdownAction.RESYNC_DURATION)
    setDisableResyncDurationItem(false)
  }

  return (
    <DropdownMenuContent>
      <DropdownMenuItem
        onClick={() => props.action$(PlaylistHeaderDropdownAction.VIEW_BACKGROUND)}
        disabled={props.disableViewBackgroundButton$}
      >
        <BsImageFill />
        <span>View playlist background</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={resyncDuration}
        disabled={disableResyncDurationItem()}
      >
        <OcIssuetracks2 />
        <span>Resync all tracks duration</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => { }}>
        <OcIssuetracks2 />
        <span>Fix track VBR header</span>
        <Spacer />
        <Tooltip label$={(
          <>
            If your track is somehow being cut off,
            click here to fix it.
          </>
        )}>
          <BsQuestionCircleFill />
        </Tooltip>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}