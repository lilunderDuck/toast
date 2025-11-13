import type { gallery } from "~/wailsjs/go/models"
import { useGalleryContext, type IGalleryContext } from "../../provider"
import { FileContentDisplay, type IImageProps, type IVideoProps } from "../../../files"
import GalleryItemEmpty from "./GalleryItemEmpty"
import { Show } from "solid-js"

interface IGalleryItemProps {
  item$: gallery.GalleryItem | undefined
  context$?: IGalleryContext
}

export function GalleryItem(props: IGalleryItemProps) {
  const { getDisplayUrl$, isFullscreen$ } = useGalleryContext() ?? props.context$

  const fileName = () => props.item$!.name

  const dataMapping = () => {
    switch (props.item$?.type) {
      case FileType.VIDEO: return {
        src$: getDisplayUrl$(fileName()),
        // enable auto play when on fullscreen mode
        autoplay$: isFullscreen$()
      } as IVideoProps

      case FileType.IMAGE: return {
        src$: getDisplayUrl$(fileName())
      } as IImageProps
    }
  }

  return (
    <Show when={props.item$} fallback={<GalleryItemEmpty />}>
      <FileContentDisplay data$={{
        props$: dataMapping()!,
        type$: props.item$!.type
      }} />
    </Show>
  )
}