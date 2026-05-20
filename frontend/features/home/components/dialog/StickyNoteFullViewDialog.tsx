import { BsX } from "solid-icons/bs"
// ...
import { DialogContent } from "~/components"
import type { IBaseLazyDialog } from "~/hooks"
import type { IContextBridge } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { StickyNoteTitle, type IStickyNoteContext, type StickyNoteAction } from "../sticky-notes"

const style = stylex.create({
  dialog: {
    position: "relative",
    width: "55%"
  },
  dialog__background: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.25,
    backgroundColor: "var(--sticky-note-background-color)",
    borderRadius: 6,
  },
  dialog__button: {
    width: 30,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    flexShrink: 0,
    padding: 0,
    ":hover": {
      backgroundColor: "var(--surface0)"
    }
  }
})

interface IStickyNoteFullViewDialogProps extends IBaseLazyDialog, IActionHandler<StickyNoteAction>, IContextBridge<IStickyNoteContext> {
}

export default function StickyNoteFullViewDialog(props: IStickyNoteFullViewDialogProps) {
  return (
    <DialogContent
      {...stylex.attrs(style.dialog)}
      style={`--sticky-note-background-color:${props.context$!.color$()}`}
      showCloseButton$={false}
    >
      <div {...stylex.attrs(style.dialog__background)} />
      <StickyNoteTitle 
        action$={props.action$}
        context$={props.context$}
        shouldShowOpenFullviewOptions$={false}
      >
        <button {...stylex.attrs(style.dialog__button)} onClick={props.close$}>
          <BsX size={30} />
        </button>
      </StickyNoteTitle>
      {/* @ts-ignore */}
      <props.context$.ContentInput$ />
    </DialogContent>
  )
}