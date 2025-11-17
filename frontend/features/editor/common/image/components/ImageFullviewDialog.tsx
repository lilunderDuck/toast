import { AppTitleBarDraggable, DialogContent } from "~/components"
import type { ILazyDialog } from "~/hooks"
import { ZoomAndPanProvider, ZoomButtonRow, ZoomDisplay } from "~/features/editor/extensions/gallery"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Image } from "../Image"


const style = stylex.create({
  dialog: {
    padding: "0 !important",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent !important",
  },
  dialog__buttonRow: {
    position: "absolute",
    margin: 10,
    zIndex: 10
  },
  dialog__draggableTitleBar: {
    position: "fixed"
  }
})

interface IImageFullviewDialogProps extends ILazyDialog {
  src$: string
}

export default function ImageFullviewDialog(props: IImageFullviewDialogProps) {
  return (
    <DialogContent {...stylex.attrs(style.dialog)} showCloseButton$={false}>
      <AppTitleBarDraggable {...stylex.attrs(style.dialog__draggableTitleBar)} />
      <ZoomAndPanProvider>
        <div {...stylex.attrs(style.dialog__buttonRow)}>
          <ZoomButtonRow />
        </div>
        <ZoomDisplay>
          <Image src$={props.src$} />
        </ZoomDisplay>
      </ZoomAndPanProvider>
    </DialogContent>
  )
}