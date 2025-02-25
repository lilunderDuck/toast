import { api_getGallerySavedPath } from "~/api/media"
import { FlexCenter } from "~/components"
import { createStorage, mergeClassname } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { useGalleryDataContext } from "../../data"
import { onMount } from "solid-js"

const style = stylex.create({
  thisList: {
    width: '100%',
    height: '100%',
    willChange: 'transform',
    // position: 'relative'
  },
  itemFullView: {
    width: 'fit-content',
    // position: 'relative',
    // width: '100%',
    // height: '100%',
    flexShrink: 0,
    position: 'absolute',
    scale: 'var(--scale)',
    transition: 'scale 0.25s ease-out',
    overflow: 'hidden',
    // background: 'center center no-repeat var(--url)',
    // backgroundSize: 'contain'
  },
  image: {
    // position: 'absolute'
    marginInline: 10
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
      __scrollbarStyle.scrollbarVertical,
      __scrollbarStyle.invsScrollbar,
      stylex.attrs(style.thisList)
    )} >
      <FlexCenter
        class={mergeClassname(
          stylex.attrs(style.itemFullView)
        )}
        style={{
          '--scale': props.scale$,
        }}
      >
        <img
          {...stylex.attrs(style.image)}
          src={api_getGallerySavedPath(
            wrappedSessionStorage.get$('currentGroup').id,
            galleryId$,
            images$()[page$.currentPage$()]
          )}
        />
      </FlexCenter>
    </FlexCenter>
  )
}