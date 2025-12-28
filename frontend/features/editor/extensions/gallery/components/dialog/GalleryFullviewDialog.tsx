import { onCleanup, Show } from "solid-js"
import { BsBox2HeartFill } from "solid-icons/bs"
// ...
import { DialogContent } from "~/components"
import { useEventListener, type IBaseLazyDialog } from "~/hooks"
import { ZoomAndPanProvider, ZoomButtonRow, ZoomDisplay } from "~/features/pan-and-zoom"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { GalleryContent } from "../items/GalleryContent"
import { type IGalleryContext } from "../../provider"
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
    marginTop: 5,
    paddingRight: 10,
    display: "flex",
    gap: 10,
    alignItems: "center",
    backgroundColor: "var(--gray1)",
    borderRadius: 6,
    opacity: 0.4,
    transition: "0.1s ease-out",
    ":hover": {
      opacity: 1
    }
  },
  dialog__content: {
    width: "100%",
    height: "100%",
    userSelect: "none"
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

interface IGalleryFullviewProps extends IBaseLazyDialog, IGalleryContext { }

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
        <div {...stylex.attrs(style.dialog__buttonRow)}>
          <ZoomButtonRow />
          <NextAndPrevButtons context$={props} />
        </div>
        <div {...stylex.attrs(style.dialog__content)}>
          <Show when={props.data$().items.length === 0} fallback={
            <ZoomDisplay>
              <GalleryContent context$={props} />
            </ZoomDisplay>
          }>
            <div {...stylex.attrs(style.dialog__emptyGallery)}>
              <span>
                <BsBox2HeartFill size={40} />
              </span>
              Nothing in here, try uploading some files.
            </div>
          </Show>
        </div>
      </ZoomAndPanProvider>
    </DialogContent>
  )
}