import "~/styles/shorthand.css"
import { css } from "molcss"
// ...
import { createLazyLoadedDialog } from "~/hooks"
// ...
import type { StickyNoteAction } from "./types"
import { StickyNoteTitle } from "./StickyNoteTitle"
import { useStickyNoteContext } from "./StickyNoteProvider"

const block = css`
  width: 13.5rem;
  height: 12rem;
  border-radius: 6px;
  transition: 0.15s ease-out;
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
  const context = useStickyNoteContext()
  const { color$, buttonRowShouldAlwaysShow$, ContentInput$, onDelete$ } = context

  const { Dialog$, show$: showFullViewDialog, close$ } = createLazyLoadedDialog(
    () => import("../dialog/StickyNoteFullViewDialog"),
    () => ({
      action$: stickyNoteActionHandler,
      context$: context
    })
  )

  const stickyNoteActionHandler: IActionHandler<StickyNoteAction>["action$"] = (type) => {
    console.log("selected:", type)
    switch (type) {
      case "delete_sticky_note$":
        onDelete$()
        close$()
      break
      
      case "open_sticky_note_in_fullview$":
        showFullViewDialog()
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

      <Dialog$ />
    </div>
  )
}