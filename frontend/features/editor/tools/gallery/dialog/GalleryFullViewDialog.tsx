import { Match, Switch } from "solid-js"
// ...
import { getGalleryItemUrl, IGalleryItemData, MEDIA_TYPE__IMAGE } from "~/api/journal"
import { DialogContent, type IDialog } from "~/components"
import { useJournalContext } from "~/features/journal"
import { ImageDisplay, useZoomAndPanContext, ZoomAndPanProvider, ZoomButtonRow } from "~/features/zoom-n-pan"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { type IGalleryDataContext, useGalleryDataContext } from "../data"
import ButtonRow from "./ButtonRow"

const style = stylex.create({
  everything: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent !important",
    maxHeight: "100vh",
    padding: 0
  }
})

interface IGalleryFullViewDialogProps extends IDialog {
  currentItem$?: IGalleryItemData
  context: IGalleryDataContext
}

export default function GalleryFullViewDialog(props: IGalleryFullViewDialogProps) {
  const { page$, galleryItem$, galleryId$ } = props.context
  const { getCurrentGroup$ } = useJournalContext()

  const handleInput: EventHandler<"div", "onKeyUp"> = (keyboardEvent) => {
    const keyYouPressed = keyboardEvent.key.toLowerCase()

    const isGoingForward = ["arrowright", "d"].includes(keyYouPressed)
    if (isGoingForward) {
      page$.focusNext$()
      return
    }
  }

  if (props.currentItem$) {
    // ...
  }

  const currentItemToShow = () => galleryItem$()[page$.currentPage$()]

  const zoomAndPanLoader = (fileName: string) => {
    const { changeDisplayImage$ } = useZoomAndPanContext()
    changeDisplayImage$(
      getGalleryItemUrl(getCurrentGroup$().id, galleryId$, fileName)
    )
  }

  return (
    <DialogContent onKeyUp={handleInput} {...stylex.attrs(style.everything)}>
      <Switch>
        <Match when={currentItemToShow().type === MEDIA_TYPE__IMAGE}>
          <ZoomAndPanProvider>
            <ButtonRow {...props.context}>
              <ZoomButtonRow />
            </ButtonRow>
            {void zoomAndPanLoader(currentItemToShow().name)}
            <ImageDisplay />
          </ZoomAndPanProvider>
        </Match>
      </Switch>
    </DialogContent>
  )
}