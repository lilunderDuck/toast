import { 
  type IVideoProps, 
  Video 
} from "../shared"

export type FileContentPropsMapping = {
  [FileType.VIDEO]: IVideoProps
}

type FileContentData<T extends FileType.VIDEO> = { type$: T, props$: FileContentPropsMapping[T] }

interface IFileContentDisplayProps {
  // data$: 
  data$: 
    FileContentData<FileType.VIDEO>
    // { type$: FileType.VIDEO, props$: IVideoProps }
  // 
}

export function FileContentDisplay(props: IFileContentDisplayProps) {
  const componentProps = () => props.data$.props$!
  switch (props.data$.type$) {
    case FileType.VIDEO: return <Video {...componentProps()} />
    default:
      break
  }
}