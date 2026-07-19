import "~/styles/shorthand.css"
import { css } from "molcss"
// ...
import { createLazyComponent } from "~/hooks"
import type { IActionHandler } from "~/utils"
// ...
import type { StickyNoteAction } from "../provider/types"
import { StickyNoteTitle } from "./StickyNoteTitle"
import { useStickyNoteBlockContext } from "./StickyNoteBlockProvider"

const block = css`
  width: 13.5rem;
  height: 12rem;
  border-radius: 6px;
  position: relative;
  padding-inline: 10px;
  padding-block: 5px;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    opacity: 0.25;
    background-color: var(--sticky-note-background-color);
    border-radius: 6px;
  }
`

export function StickyNoteBlock() {
  const context = useStickyNoteBlockContext()
  const { color$, buttonRowShouldAlwaysShow$, ContentInput$, onDelete$ } = context

  const StickyNoteFullViewDialog = createLazyComponent(
    LazyComponentType.DIALOG,
    () => import("./dialog/StickyNoteFullViewDialog"),
    () => ({
      action$: stickyNoteActionHandler,
      context$: context
    })
  )

  const stickyNoteActionHandler: IActionHandler<StickyNoteAction>["action$"] = (type) => {
    switch (type) {
      case "delete_sticky_note$":
        onDelete$()
        StickyNoteFullViewDialog.close$()
      break
      
      case "open_sticky_note_in_fullview$":
        StickyNoteFullViewDialog.show$()
      break
    }
  }

  return (
    <div
      class={`${block} ${buttonRowShouldAlwaysShow$() ? "showOnHover__alwaysShow" : "showOnHover"}`}
      style={`--sticky-note-background-color:${color$()}`}
    >
      <StickyNoteTitle action$={stickyNoteActionHandler} />
      <ContentInput$ />

      <StickyNoteFullViewDialog.Component$ />
    </div>
  )
}