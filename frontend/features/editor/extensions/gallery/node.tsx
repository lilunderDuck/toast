import { Show } from "solid-js"
import { BsDisplayFill } from "solid-icons/bs"
import { macro_mergeClassnames } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./node.module.css"
// ...
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"
// ...
import { GalleryButtonRow, GalleryContent, LeftButtonSide, RightButtonSide } from "./components"
import { GalleryProvider, useGalleryContext } from "./provider"

const style = stylex.create({
  gallery: {
    position: "relative",
    width: "100%",
    height: "var(--gallery-height)",
    backgroundColor: "var(--gray3)",
    marginBottom: 20
  },
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

export default function GalleryNodeView() {
  const Content = () => {
    const { isFullscreen$ } = useGalleryContext()

    return (
      // Avoid file from being loaded 2 times when gallery on fullscreen.
      <div {...stylex.attrs(style.gallery__content)} id={__style.galleryContent}>
        <Show when={!isFullscreen$()} fallback={
          <BsDisplayFill size={30} />
        }>
          <GalleryContent />
        </Show>
      </div>
    )
  }

  return (
    <NodeViewWrapper class={macro_mergeClassnames(stylex.attrs(style.gallery), __style.gallery)}>
      <GalleryProvider>
        <LeftButtonSide />
        <GalleryButtonRow />
        <RightButtonSide />
        <Content />
      </GalleryProvider>
    </NodeViewWrapper>
  )
}