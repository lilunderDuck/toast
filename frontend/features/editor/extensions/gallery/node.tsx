import { lazy, Match, Switch } from "solid-js"
import { macro_mergeClassnames } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./node.module.css"
// ...
import { NodeViewWrapper, useSolidNodeView } from "~/libs/solid-tiptap-renderer"
// ...
import { GalleryProvider } from "./provider"
import type { GalleryAttribute } from "./extension"
import { GalleryLoadingView } from "./components"

const style = stylex.create({
  gallery: {
    position: "relative",
    width: "100%",
    height: "var(--gallery-height)",
    backgroundColor: "var(--gray3)",
    marginBlock: 20,
    userSelect: "none"
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

const SplitViewGalleryView = lazy(() => import("./view/SplitViewGalleryView"))
const SingleItemGalleryView = lazy(() => import("./view/SingleItemGalleryView"))

export default function GalleryNodeView() {
  const { attrs$ } = useSolidNodeView<GalleryAttribute>()

  return (
    <GalleryProvider>
      <NodeViewWrapper class={macro_mergeClassnames(stylex.attrs(style.gallery), __style.gallery)}>
        <GalleryLoadingView />
        <Switch fallback={<SingleItemGalleryView />}>
          <Match when={attrs$().viewMode === GalleryViewMode.SINGLE_ITEM}>
            <SingleItemGalleryView />
          </Match>
          
          <Match when={attrs$().viewMode === GalleryViewMode.SPLIT_VIEW}>
            <SplitViewGalleryView />
          </Match>
        </Switch>
      </NodeViewWrapper>
    </GalleryProvider>
  )
}