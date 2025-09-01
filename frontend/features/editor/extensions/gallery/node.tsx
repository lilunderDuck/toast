import stylex from "@stylexjs/stylex"
// ...
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"
// ...
import { GalleryButtonRow, GalleryContent } from "./components"
import { GalleryProvider, useGalleryContext } from "./provider"
import { Show } from "solid-js"
import { BsDisplayFill } from "solid-icons/bs"

const style = stylex.create({
  gallery: {
    position: "relative",
    width: "100%",
    height: "19rem",
    backgroundColor: "var(--gray3)",
    marginBottom: 20
  },
  gallery__content: {
    width: "100%",
    height: "19rem",
    position: "absolute",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  }
})

export default function GalleryNodeView() {
  const Content = () => {
    const { isFullscreen$ } = useGalleryContext()

    return (
      // Avoid file from being loaded 2 times when gallery on fullscreen.
      <div {...stylex.attrs(style.gallery__content)}>
        <Show when={!isFullscreen$()} fallback={
          <BsDisplayFill size={30} />
        }>
          <GalleryContent />
        </Show>
      </div>
    )
  }

  return (
    <NodeViewWrapper {...stylex.attrs(style.gallery)}>
      <GalleryProvider>
        <GalleryButtonRow />
        <Content />
      </GalleryProvider>
    </NodeViewWrapper>
  )
}