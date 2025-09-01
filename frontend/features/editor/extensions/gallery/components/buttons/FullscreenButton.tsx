import { BsFullscreen } from "solid-icons/bs";
import { Button, createLazyLoadedDialog, Tooltip } from "~/components";
import { useGalleryContext } from "../../provider";

export function FullscreenButton() {
  const context = useGalleryContext()
  const GalleryFullscreenDialog = createLazyLoadedDialog(
    () => import("../dialog/GalleryFullviewDialog"),
    () => context
  )

  return (
    <>
      <Tooltip label$="Fullscreen mode">
        <Button
          size$={ButtonSize.ICON}
          disabled={!context.data$()}
          onClick={GalleryFullscreenDialog.show$}
        >
          <BsFullscreen />
        </Button>
      </Tooltip>
      <GalleryFullscreenDialog.Dialog$ />
    </>
  )
}