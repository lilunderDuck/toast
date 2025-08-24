export interface IImageProps {
  src$: string
}

export function Image(props: IImageProps) {
  return (
    <img
      loading="lazy"
      src={props.src$}
    />
  )
}