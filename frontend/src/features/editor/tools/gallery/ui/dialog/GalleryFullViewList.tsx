import { For } from "solid-js"
// ...
import { api_getGallerySavedPath } from "~/api/media"
import { FlexCenter } from "~/components"
import { mergeClassname, createStorage } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { useGalleryDataContext } from "../../data"
import Image from "../../../image/Image"

const style = stylex.create({
  thisList: {
    width: '100%',
    height: '90%',
    willChange: 'transform'
  },
  itemFullView: {
    flexShrink: 0,
    scale: 'var(--scale)',
    transition: 'scale 0.25s ease-out',
    width: 'fit-content',
  },
  hideImage: {
    display: 'none'
  }
})

interface IGalleryFullViewListProps {
  scale$: number
}

export default function GalleryFullViewList(props: IGalleryFullViewListProps) {
  const { images$, page$, galleryId$ } = useGalleryDataContext()
  page$.currentPage$()
  // TODO: fix this weird hack
  const wrappedSessionStorage = createStorage(sessionStorage)

  return (
    <FlexCenter class={mergeClassname(
      __scrollbarStyle.scrollbarHorizontal,
      __scrollbarStyle.invsScrollbar,
      stylex.attrs(style.thisList)
    )}>
      <For each={images$()}>
        {(it, index) => (
          <FlexCenter 
            {...stylex.attrs(
              style.itemFullView,
              page$.currentPage$() !== index() ? style.hideImage : {}
            )} 
            id={page$.pageIndexName$(index())}
            style={{
              '--scale': props.scale$
            }}
          >
            <Image 
              name$="" 
              description$="" 
              src$={api_getGallerySavedPath(
                wrappedSessionStorage.get$('currentGroup').id,
                galleryId$,
                it
              )} 
            />
          </FlexCenter>
        )}
      </For>
    </FlexCenter>
  )
}