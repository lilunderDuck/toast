import stylex from "@stylexjs/stylex"
// ...
import { NodeViewWrapper } from "../../components"
import { GalleryButtonRow, GalleryContent, LeftButtonSide, RightButtonSide } from "./components"
import { GalleryProvider } from "./provider"

const style = stylex.create({
  gallery: {
    position: "relative",
    width: "100%",
    height: "19rem",
    backgroundColor: "var(--gray3)",
  },
  gallery__content: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1
  }
})

export default function GalleryNodeView() {
  return (
    <NodeViewWrapper {...stylex.attrs(style.gallery)}>
      <GalleryProvider>
        <GalleryButtonRow />
        <LeftButtonSide />
        <div {...stylex.attrs(style.gallery__content)}>
          <GalleryContent />
        </div>
        <RightButtonSide />
      </GalleryProvider>
    </NodeViewWrapper>
  )
}