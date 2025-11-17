import { Image, type IImageProps } from "../image"
import { Video, type IVideoProps } from "../video"

export type FileContentPropsMapping = {
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

export function FileContentDisplay(props: IFileContentDisplayProps) {
  const componentProps = () => props.data$.props$!
  switch (props.data$.type$) {
    case FileType.VIDEO: return <Video {...componentProps()} />
    case FileType.IMAGE: return <Image {...componentProps()} />
    default:
      break
  }
}