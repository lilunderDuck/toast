import { lazy, Match, Switch } from "solid-js"
import { macro_mergeClassnames } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./node.module.css"
// ...
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"
// ...
import { GalleryProvider } from "./provider"
import { useNodeState } from "../../utils"
import type { GalleryAttribute } from "./extension"

const style = stylex.create({
  gallery: {
    position: "relative",
    width: "100%",
    height: "var(--gallery-height)",
    backgroundColor: "var(--gray3)",
    marginBlock: 20
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
  const { data$ } = useNodeState<GalleryAttribute>()

  return (
    <GalleryProvider>
      <NodeViewWrapper class={macro_mergeClassnames(stylex.attrs(style.gallery), __style.gallery)}>
        <Switch fallback={<SingleItemGalleryView />}>
          <Match when={data$().viewMode === GalleryViewMode.SINGLE_ITEM}>
            <SingleItemGalleryView />
          </Match>
          
          <Match when={data$().viewMode === GalleryViewMode.SPLIT_VIEW}>
            <SplitViewGalleryView />
          </Match>
        </Switch>
      </NodeViewWrapper>
    </GalleryProvider>
  )
}