import { createEffect } from "solid-js"
// ...
import { DialogContent, Flex } from "~/components"
import { ImageDisplay, useZoomAndPanContext, ZoomAndPanProvider, ZoomButtonRow } from "~/features/zoom-n-pan"
import { createStorage } from "~/utils"
import { api_getGallerySavedPath } from "~/api/media"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import GalleryButtonRow from "../GalleryButtonRow"
import { useGalleryDataContext } from "../../data"

const style = stylex.create({
  content: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent !important',
    overflowY: 'hidden',
    padding: `0 !important`,
    willChange: 'transform',
    ':focus': {
      outline: 'none'
    },
    position: 'relative'
  },
  innerContent: {
    width: '100%',
    height: '100%',
  },
  galleryList: {
    backgroundColor: 'transparent !important'
  },
  buttonRow: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    position: 'absolute',
    zIndex: 10
  }
})

export default function GalleryDialog() {
  const { images$, page$, galleryId$ } = useGalleryDataContext()
  // TODO: fix this weird hack
  const wrappedSessionStorage = createStorage(sessionStorage)

  const AutoChangeImage = () => {
    const { changeDisplayImage$ } = useZoomAndPanContext()
    
    createEffect(() => {
      const imageChanged = page$.currentPage$()
      changeDisplayImage$(api_getGallerySavedPath(
        wrappedSessionStorage.get$('currentGroup').id,
        galleryId$,
        images$()[imageChanged]
      ))
    })

    return undefined // renders nothing
  }

  return (
    <DialogContent {...stylex.attrs(style.content)}>
      <ZoomAndPanProvider>
        <AutoChangeImage />
        <Flex {...stylex.attrs(style.buttonRow)}>
          <GalleryButtonRow>
            <ZoomButtonRow />
          </GalleryButtonRow>
        </Flex>
        <ImageDisplay />
      </ZoomAndPanProvider>
    </DialogContent>
  )
}