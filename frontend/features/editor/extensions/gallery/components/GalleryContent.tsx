import { Show } from "solid-js"
// ...
import { type IGalleryContext, useGalleryContext } from "../provider"
import { FileContentDisplay, type IImageProps, type IVideoProps } from "../../files"

interface IGalleryContentProps {
  context$?: IGalleryContext
}

export function GalleryContent(props: IGalleryContentProps) {
  const { getDisplayUrl$, currentItem$, isFullscreen$ } = useGalleryContext() ?? props.context$

  const fileName = () => currentItem$()!.name

  const dataMapping = () => {
    switch(currentItem$()?.type) {
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
    <Show when={currentItem$()}>
      <FileContentDisplay data$={{
        props$: dataMapping()!,
        type$: currentItem$()!.type
      }} />
    </Show>
  )
}