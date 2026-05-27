import { ZoomAndPanProvider, ZoomButtonRow, ZoomDisplay } from "~/libs/pan-and-zoom";
import { Button, DialogContent, Tooltip } from "../ui";
import type { IBaseLazyDialog } from "~/hooks";

import stylex from "@stylexjs/stylex"
import { BsX } from "solid-icons/bs";

const style = stylex.create({
  dialog: {
    width: "100%",
    height: "100%",
    padding: "0 !important",
    backgroundColor: "transparent !important"
  },
  dialog__image: {
    height: "auto"
  },
  dialog__zoomButtonRow: {
    position: "absolute",
    zIndex: 20
  }
})

interface IImageFullviewDialogContentProps extends IBaseLazyDialog {
  imageSrc$: string
}

export default function ImageFullviewDialogContent(props: IImageFullviewDialogContentProps) {
  return (
    <DialogContent {...stylex.attrs(style.dialog)} showCloseButton$={false}>
      <ZoomAndPanProvider>
        <div {...stylex.attrs(style.dialog__zoomButtonRow)}>
          <ZoomButtonRow>
            <Tooltip label$="Close">
              <Button 
                size$={ButtonSize.ICON}
                onClick={props.close$}
              >
                <BsX size={17} />
              </Button>
            </Tooltip>
          </ZoomButtonRow>
        </div>
        <ZoomDisplay>
          <img {...stylex.attrs(style.dialog__image)} src={props.imageSrc$} />
        </ZoomDisplay>
      </ZoomAndPanProvider>
    </DialogContent>
  )
}