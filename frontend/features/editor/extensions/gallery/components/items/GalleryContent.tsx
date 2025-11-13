import { type IGalleryContext, useGalleryContext } from "../../provider"
import { GalleryItem } from "./GalleryItem"

interface IGalleryContentProps {
  context$?: IGalleryContext
}

export function GalleryContent(props: IGalleryContentProps) {
  const { currentItem$ } = useGalleryContext() ?? props.context$

  return (
    <GalleryItem item$={currentItem$()} context$={props.context$} />
  )
}