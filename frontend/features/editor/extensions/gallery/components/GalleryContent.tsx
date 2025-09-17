import { type IGalleryContext, useGalleryContext } from "../provider"
import { GalleryItemContent } from "./GalleryItemContent"

interface IGalleryContentProps {
  context$?: IGalleryContext
}

export function GalleryContent(props: IGalleryContentProps) {
  const { currentItem$ } = useGalleryContext() ?? props.context$

  return (
    <GalleryItemContent item$={currentItem$()} context$={props.context$} />
  )
}