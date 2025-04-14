import { IImageDataProviderProps, ImageDataProvider } from "./provider/"
import ImageInput from "./ImageInput"

export interface IImageData {
  imgName: string
  description?: string
}

export interface IImageProps {
  src$: string
  name$: string
  description$?: string
}

export function Image(props: IImageDataProviderProps) {
  return (
    <ImageDataProvider {...props}>
      <ImageInput />
    </ImageDataProvider>
  )
}