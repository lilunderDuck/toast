import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { FlexCenterY, Tooltip } from "~/components"
// import { useEditorContext } from "~/features/editor"
import { mergeClassname } from "~/utils"
import { api_getGallerySavedPath } from "~/api/media"
import { useJournalContext } from "~/features/journal"
// ...
import GalleryItem from "./GalleryItem"
import { useGalleryDataContext } from "../data"

const style = stylex.create({
  list: {
    borderRadius: 6,
    backgroundColor: 'var(--gray3)',
    marginBottom: 10,
    gap: 10
  }
})

interface IGalleryListProps extends HTMLAttributes<"div"> {
  // define your component props here
}

export default function GalleryList(props: IGalleryListProps) {
  // const { isReadonly$ } = useEditorContext()
  const { sessionStorage$ } = useJournalContext()
  const { images$, page$, galleryId$ } = useGalleryDataContext()

  return (
    <Tooltip label$="Choose multiple images">
      <FlexCenterY class={mergeClassname(
        props, 
        __scrollbarStyle.scrollbarHorizontal,
        __scrollbarStyle.invsScrollbar,
        stylex.attrs(style.list)
      )} {...props}>
        <For each={images$()}>
          {(it, index) => (
            <GalleryItem 
              id={page$.pageIndexName$(index())} 
              src$={api_getGallerySavedPath(
                sessionStorage$.get$('currentGroup').id,
                galleryId$,
                it
              )} 
            />
          )}
        </For>
        <GalleryItem id="not-do-anything" />
      </FlexCenterY>
    </Tooltip>
  )
}