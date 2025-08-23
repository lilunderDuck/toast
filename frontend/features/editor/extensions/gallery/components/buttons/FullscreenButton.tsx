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
          size$={ButtonSize.icon}
          disabled={!context.data$()}
          onClick={GalleryFullscreenDialog.show$}
        >
          <BsFullscreen />
        </Button>
      </Tooltip>
      <GalleryFullscreenDialog.Modal$ />
    </>
  )
}