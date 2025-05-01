import stylex from "@stylexjs/stylex"
// ...
import { FlexCenter } from "~/components"
// ...
import { ImageInputAndDropzone } from "../../../common/image"

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
      <ImageInputAndDropzone 
        imageSrc$={props.src$ ?? ''} 
        isLoading$={false} 
      />
    </FlexCenter>
  )
}