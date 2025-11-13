import stylex from "@stylexjs/stylex"
import { FourDotsSpinningLoader } from "~/components"
import { useGalleryContext } from "../provider"
import { isEmptyObject } from "@tiptap/core"
import { Show } from "solid-js"

const style = stylex.create({
  loading: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
})

export function GalleryLoadingView() {
  const { data$ } = useGalleryContext()

  return (
    <Show when={isEmptyObject(data$())}>
      <div {...stylex.attrs(style.loading)}>
        <FourDotsSpinningLoader />
      </div>
    </Show>
  )
}