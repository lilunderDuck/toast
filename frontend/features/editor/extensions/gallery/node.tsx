import stylex from "@stylexjs/stylex"
// ...
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"
// ...
import { GalleryButtonRow, GalleryContent, LeftButtonSide, RightButtonSide } from "./components"
import { GalleryProvider, useGalleryContext } from "./provider"
import { Show } from "solid-js"

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
  const Content = () => {
    const { isFullscreen$ } = useGalleryContext()

    return (
      // Avoid file from being loaded 2 times when gallery on fullscreen.
      <div {...stylex.attrs(style.gallery__content)}>
        <Show when={!isFullscreen$()}>
          <GalleryContent />
        </Show>
      </div>
    )
  }

  return (
    <NodeViewWrapper {...stylex.attrs(style.gallery)}>
      <GalleryProvider>
        <GalleryButtonRow />
        <LeftButtonSide />
        <Content />
        <RightButtonSide />
      </GalleryProvider>
    </NodeViewWrapper>
  )
}