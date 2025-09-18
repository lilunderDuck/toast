import { Show } from "solid-js"
import { BsDisplayFill } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./SingleItemGalleryView.module.css"
// ...
import { useGalleryContext } from "../provider"
import { GalleryButtonRow, GalleryContent, LeftButtonSide, RightButtonSide } from "../components"

const style = stylex.create({
  gallery__content: {
    width: "100%",
    height: "var(--gallery-height)",
    position: "absolute",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  }
})

export default function SingleItemGalleryView() {
  const { isFullscreen$ } = useGalleryContext()

  return (
    <div data-gallery-view="">
      <LeftButtonSide />
      <GalleryButtonRow />
      <RightButtonSide />
      <div {...stylex.attrs(style.gallery__content)} data-gallery-view-media-content="">
        <Show when={!isFullscreen$()} fallback={
          <BsDisplayFill size={30} />
        }>
          <GalleryContent />
        </Show>
      </div>
    </div>
  )
}