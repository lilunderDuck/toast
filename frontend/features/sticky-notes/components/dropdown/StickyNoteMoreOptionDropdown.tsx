import { FaSolidTrashCan } from "solid-icons/fa"
import { OcScreenfull2 } from "solid-icons/oc"
import { Show } from "solid-js"
// ...
import { DropdownMenuContent, DropdownMenuItem } from "~/components"
import type { IBaseLazyComponent } from "~/hooks"
import type { IActionHandler } from "~/utils"
// ...
import type { StickyNoteAction } from "../types"

interface IStickyNoteMoreOptionDropdownProps extends IBaseLazyComponent, IActionHandler<StickyNoteAction> {
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