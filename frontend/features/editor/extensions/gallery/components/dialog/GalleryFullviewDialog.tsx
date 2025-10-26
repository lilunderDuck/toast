import { onCleanup, Show } from "solid-js"
import { BsBox2HeartFill } from "solid-icons/bs"
// ...
import { ButtonRow, DialogContent } from "~/components"
import { useEventListener, type ILazyDialog } from "~/hooks"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { GalleryContent } from "../GalleryContent"
import { type IGalleryContext, ZoomAndPanProvider, ZoomButtonRow, ZoomDisplay } from "../../provider"
import { NextAndPrevButtons } from "../buttons/NextAndPrevButtons"

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
    userSelect: "none"
  },
  dialog__fileName: {
    borderRadius: 6,
    paddingInline: 10,
    paddingBlock: 5,
    backgroundColor: "var(--gray3)"
  },
  dialog__emptyGallery: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexFlow: "column",
    gap: 10
  }
})

interface IGalleryFullviewProps extends ILazyDialog, IGalleryContext { }

export default function GalleryFullview(props: IGalleryFullviewProps) {
  props.setIsFullscreen$(true)

  onCleanup(() => {
    props.setIsFullscreen$(false)
  })

  useEventListener("keydown", (keyboardEvent) => {
    if (keyboardEvent.key === "Escape") {
      props.setIsFullscreen$(false)
    }
  })

  return (
    <DialogContent {...stylex.attrs(style.dialog)} showCloseButton$={false}>
      <ZoomAndPanProvider>
        <ButtonRow direction$={ButtonRowDirection.CUSTOM} {...stylex.attrs(style.dialog__buttonRow)}>
          <ZoomButtonRow />
          <NextAndPrevButtons context$={props} />
          <div {...stylex.attrs(style.dialog__fileName)}>
            {props.currentItem$()?.name}
          </div>
        </ButtonRow>
        <div {...stylex.attrs(style.dialog__content)}>
          <Show when={props.data$().items.length === 0} fallback={
            <ZoomDisplay>
              <GalleryContent context$={props} />
            </ZoomDisplay>
          }>
            <div {...stylex.attrs(style.dialog__emptyGallery)}>
              <BsBox2HeartFill size={40} />
              Nothing in here, try uploading some files.
            </div>
          </Show>
        </div>
      </ZoomAndPanProvider>
    </DialogContent>
  )
}