import stylex from "@stylexjs/stylex"
// ...
import { FlexCenter } from "~/components"
// ...
import Image from "../../image/Image"

const style = stylex.create({
  item: {
    width: '100%',
    height: '20rem',
    flexShrink: 0,
    padding: 10
  }
})

interface IGalleryItemProps {
  id: string
  src$?: string
}

export default function GalleryItem(props: IGalleryItemProps) {
  return (
    <FlexCenter {...stylex.attrs(style.item)} id={props.id}>
      <Image src$={props.src$ ?? ''} description$="" name$="" />
    </FlexCenter>
  )
}