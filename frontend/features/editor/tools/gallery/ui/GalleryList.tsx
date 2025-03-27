import { For, Show, splitProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { FlexCenterY, Tooltip } from "~/components"
import { useEditorContext } from "~/features/editor"
import { mergeClassname } from "~/utils"
import { api_getGallerySavedPath } from "~/api/media"
import { useJournalContext } from "~/features/journal"
// ...
import GalleryItem from "./GalleryItem"
import { useGalleryDataContext } from "../data"

const style = stylex.create({
  list: {
    borderRadius: 6,
    marginBottom: 10,
    gap: 10
  },
  list_normalView: {
    backgroundColor: 'var(--gray3)',
  },
  list_fullView: {
    backgroundColor: 'transparent'
  },
  item: {
    height: 'auto !important'
  }
})

interface IGalleryListProps extends HTMLAttributes<"div"> {
  isOnFullScreen$?: boolean
}

export default function GalleryList(props: IGalleryListProps) {
  const { isReadonly$ } = useEditorContext()
  const { getCurrentGroup$ } = useJournalContext()
  const { images$, page$, galleryId$ } = useGalleryDataContext()

  const [other, divProps] = splitProps(props, ["isOnFullScreen$"])

  const Content = () => (
    <FlexCenterY class={mergeClassname(
      divProps, 
      __scrollbarStyle.scrollbarHorizontal,
      __scrollbarStyle.invsScrollbar,
      stylex.attrs(
        style.list,
        other.isOnFullScreen$ ? style.list_fullView : style.list_normalView
      )
    )} {...divProps}>
      <For each={images$()}>
        {(it, index) => (
          <GalleryItem 
            id={page$.pageIndexName$(index())} 
            src$={api_getGallerySavedPath(
              getCurrentGroup$().id,
              galleryId$,
              it
            )}
          />
        )}
      </For>
      <GalleryItem id="not-do-anything" />
    </FlexCenterY>
  )

  return (
    <Show when={isReadonly$() || other.isOnFullScreen$} fallback={
      <Tooltip label$="Choose multiple images">
        <Content />
      </Tooltip>
    }>
      <Content />
    </Show>
  )
}