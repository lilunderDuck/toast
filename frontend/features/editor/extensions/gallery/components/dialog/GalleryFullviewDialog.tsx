import { ButtonRow, DialogContent, Spacer, type IDialog } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { GalleryContent } from "../GalleryContent"
import { IGalleryContext, ZoomAndPanProvider, ZoomButtonRow, ZoomDisplay } from "../../provider"
import { NextAndPrevButtons } from "../NextAndPrevButtons"

const style = stylex.create({
  dialog: {
    backgroundColor: "transparent !important",
    width: "100%",
    height: "100%",
    position: "relative",
    padding: "0 !important"
  },
  dialog__buttonRow: {
    position: "absolute",
    zIndex: 10,
    marginLeft: 10,
    paddingRight: '5rem',
    width: "100%"
  },
  dialog__content: {
    width: "100%",
    height: "100%",
  },
  dialog__fileName: {
    borderRadius: 6,
    paddingInline: 10,
    paddingBlock: 5,
    backgroundColor: "var(--gray3)"
  }
})

interface IGalleryFullviewProps extends IDialog, IGalleryContext { }

export default function GalleryFullview(props: IGalleryFullviewProps) {
  return (
    <DialogContent {...stylex.attrs(style.dialog)}>
      <ZoomAndPanProvider>
        <ButtonRow direction$="custom$" {...stylex.attrs(style.dialog__buttonRow)}>
          <ZoomButtonRow />
          <div {...stylex.attrs(style.dialog__fileName)}>
            {props.currentItem$()?.name}
          </div>
          <Spacer />
          <NextAndPrevButtons context$={props} />
        </ButtonRow>
        <div {...stylex.attrs(style.dialog__content)}>
          <ZoomDisplay>
            <GalleryContent context$={props} />
          </ZoomDisplay>
        </div>
      </ZoomAndPanProvider>
    </DialogContent>
  )
}