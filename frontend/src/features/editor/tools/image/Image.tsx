export interface IImageData {
  imgName: string
  description?: string
}

export interface IImageProps {
  src$: string
  name$: string
  description$?: string
}

export default function Image(props: IImageProps) {
  return (
    <div>
      <img src={props.src$} />
    </div>
  )
}