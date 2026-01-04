import { Show } from "solid-js"
// ...
import type { gallery } from "~/wailsjs/go/models"
import { Video, type IVideoProps } from "~/features/video"
import { Image, type IImageProps } from "~/features/image"
// ...
import { useGalleryContext, type IGalleryContext } from "../../provider"
import GalleryItemEmpty from "./GalleryItemEmpty"

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

type FileContentPropsMapping = {
  [FileType.VIDEO]: IVideoProps
  [FileType.IMAGE]: IImageProps
}

// @ts-ignore
type FileContentData<T extends FileType> = { type$: T, props$: FileContentPropsMapping[T] }

interface IFileContentDisplayProps {
  data$:
  FileContentData<FileType.VIDEO> |
  FileContentData<FileType.IMAGE>
  // 
}

function FileContentDisplay(props: IFileContentDisplayProps) {
  const componentProps = () => props.data$.props$!
  switch (props.data$.type$) {
    case FileType.VIDEO: return <Video {...componentProps()} />
    case FileType.IMAGE: return <Image {...componentProps()} />
    default:
      break
  }
}