import type { editor } from "~/wailsjs/go/models";
import { useGalleryContext, type IGalleryContext } from "../provider";
import { FileContentDisplay, type IImageProps, type IVideoProps } from "../../files";
import { Show } from "solid-js";
import { BsDisplayFill } from "solid-icons/bs";

interface IGalleryItemContentProps {
  item$: editor.GalleryItem | undefined
  context$?: IGalleryContext
}

export function GalleryItemContent(props: IGalleryItemContentProps) {
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
    <Show when={props.item$} fallback={<BsDisplayFill size={30} />}>
      <FileContentDisplay data$={{
        props$: dataMapping()!,
        type$: props.item$!.type
      }} />
    </Show>
  )
}