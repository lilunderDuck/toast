import { CLS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import "~/styles/shorthand.css"
// ...
import { createLazyLoadedDialog } from "~/hooks"
// ...
import type { StickyNoteAction } from "./types"
import { StickyNoteTitle } from "./StickyNoteTitle"
import { useStickyNoteContext } from "./StickyNoteProvider"

const style = stylex.create({
  block: {
    width: "13.5rem",
    height: "12rem",
    borderRadius: 6,
    transition: "0.15s ease-out",
    position: "relative",
    paddingInline: 10,
    paddingBlock: 5,
    "::before": {
      content: "",
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: -1,
      opacity: 0.25,
      backgroundColor: "var(--sticky-note-background-color)",
      borderRadius: 6,
    }
  }
})

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
      class={`${CLS(style.block)} ${buttonRowShouldAlwaysShow$() ? "showOnHover__alwaysShow" : "showOnHover"}`}
      style={`--sticky-note-background-color:${color$()}`}
    >
      <StickyNoteTitle action$={stickyNoteActionHandler} />
      <ContentInput$ />

      <Dialog$ />
    </div>
  )
}