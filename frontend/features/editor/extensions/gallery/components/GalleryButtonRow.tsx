import { BsFullscreen, BsPlus, BsUpload } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Button, ButtonRow, createLazyLoadedDialog, Spacer, Tooltip } from "~/components"
import { useGalleryContext } from "../provider"
import { Show } from "solid-js"
import { NextAndPrevButtons } from "./NextAndPrevButtons"

const style = stylex.create({
  buttonRow: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 11,
    paddingInline: 10
  },
  buttonRow__name: {
    borderRadius: 6,
    paddingInline: 10,
    paddingBlock: 5,
    backgroundColor: "var(--gray1)"
  }
})

export function GalleryButtonRow() {
  const { data$, currentItem$ } = useGalleryContext()
  const GalleryFullscreenDialog = createLazyLoadedDialog(
    () => import("./dialog/GalleryFullviewDialog"),
    () => useGalleryContext()
  )

  const GalleryDirectoryUploadDialog = createLazyLoadedDialog(
    () => import("./dialog/GalleryDirectoryUploadDialog")
  )

  return (
    <ButtonRow {...stylex.attrs(style.buttonRow)} direction$="custom$">
      <Show when={currentItem$()}>
        <div {...stylex.attrs(style.buttonRow__name)}>
          {currentItem$().name}
        </div>
      </Show>
      <Tooltip label$={<>Upload a <i>single</i> media</>}>
        <Button
          size$={ButtonSize.icon}
          disabled={!data$()}
        >
          <BsPlus />
        </Button>
      </Tooltip>
      <Tooltip label$={<>Upload the <i>whole directory</i></>}>
        <Button
          size$={ButtonSize.icon}
          disabled={!data$()}
          onClick={GalleryDirectoryUploadDialog.show$}
        >
          <BsUpload />
        </Button>
      </Tooltip>
      <Tooltip label$="Fullscreen mode">
        <Button
          size$={ButtonSize.icon}
          disabled={!data$()}
          onClick={GalleryFullscreenDialog.show$}
        >
          <BsFullscreen />
        </Button>
      </Tooltip>
      <Spacer />
      <NextAndPrevButtons />
      <GalleryFullscreenDialog.Modal$ />
      <GalleryDirectoryUploadDialog.Modal$ />
    </ButtonRow>
  )
}