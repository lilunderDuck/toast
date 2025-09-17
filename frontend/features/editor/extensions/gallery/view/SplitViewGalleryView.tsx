import stylex from "@stylexjs/stylex"
import { GalleryButtonRow, GalleryItemContent } from "../components"
import { useGalleryContext } from "../provider"

const style = stylex.create({
  gallery: {
    display: "flex",
    width: "100%",
    height: "100%"
  },
  gallery__splitView: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "var(--gray11)",
    padding: 15
  },
  gallery__divider: {
    width: 3,
    // height: "100%",
    marginInline: 5,
    borderRadius: 6,
    backgroundColor: "var(--gray5)"
  }
})

export default function SplitViewGalleryView() {
  const { data$ } = useGalleryContext()

  return (
    <div {...stylex.attrs(style.gallery)} data-gallery-view>
      <GalleryButtonRow
        showFilename$={false}
      />
      <div
        {...stylex.attrs(style.gallery__splitView)}
        data-gallery-view-media-content=""
      >
        <GalleryItemContent item$={data$().items[0]} />
      </div>
      <div {...stylex.attrs(style.gallery__divider)} />
      <div
        {...stylex.attrs(style.gallery__splitView)}
        data-gallery-view-media-content=""
      >
        <GalleryItemContent item$={data$().items[1]} />
      </div>
    </div>
  )
}