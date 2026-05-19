import { FaSolidTrashCan } from "solid-icons/fa"
import { OcScreenfull2 } from "solid-icons/oc"
// ...
import { DropdownMenuContent, DropdownMenuItem } from "~/components"
import type { IBaseDropdownMenu } from "~/hooks"
// ...
import type { StickyNoteAction } from "../sticky-notes/types"
import { Show } from "solid-js"

interface IStickyNoteMoreOptionDropdownProps extends IBaseDropdownMenu, IActionHandler<StickyNoteAction> {
  shouldShowOpenFullviewOptions$?: boolean
}

export default function StickyNoteMoreOptionDropdown(props: IStickyNoteMoreOptionDropdownProps) {
  return (
    <DropdownMenuContent>
      <Show when={props.shouldShowOpenFullviewOptions$ ?? true}>
        <DropdownMenuItem onClick={() => props.action$("open_sticky_note_in_fullview$")}>
          <OcScreenfull2 />
          <span>Open in full view</span>
        </DropdownMenuItem>
      </Show>
      <DropdownMenuItem onClick={() => props.action$("delete_sticky_note$")}>
        <FaSolidTrashCan />
        <span>Delete this</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}