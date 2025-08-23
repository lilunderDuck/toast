import { Show } from "solid-js"
// ...
import { IGalleryContext, useGalleryContext } from "../provider"
import { FileContentDisplay, IVideoProps } from "../../files"

interface IGalleryContentProps {
  context$?: IGalleryContext
}

export function GalleryContent(props: IGalleryContentProps) {
  const { getDisplayUrl$, currentItem$, isFullscreen$ } = useGalleryContext() ?? props.context$

  const dataMapping = () => {
    switch(currentItem$()?.type) {
      case FileType.VIDEO: return { 
        path: getDisplayUrl$(currentItem$()!.name),
        // enable auto play when on fullscreen mode
        autoplay$: isFullscreen$()
      } as IVideoProps
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