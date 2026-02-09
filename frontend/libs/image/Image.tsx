export interface IImageProps {
  src$: string
  class?: string
}

export function Image(props: IImageProps) {
  return (
    <img
      loading="lazy"
      src={props.src$}
      class={props.class}
    />
  )
}