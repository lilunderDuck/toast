import { useParams, useSearchParams } from "@solidjs/router";
// ...
import { css } from "molcss";
import "./[galleryId].css"
// ...
import { ZoomAndPanProvider, ZoomDisplay } from "~/components";
import { GalleryItemDisplay, GalleryNav, GalleryProvider } from "~/features/gallery";
import { useBodyClass } from "~/hooks";

const gallery__page = css`
  width: 100%;
  height: 100%;
  position: relative;
`

export default function GalleryPage() {
  const param = useParams()
  const [searchParam] = useSearchParams<{ directory?: string }>()

  useBodyClass("galleryPage__active")

  return (
    <ZoomAndPanProvider>
      <GalleryProvider
        galleryId$={param.galleryId as string}
        directory$={searchParam.directory}
      >
        <main class={gallery__page}>
          <GalleryNav />
          <ZoomDisplay>
            <GalleryItemDisplay />
          </ZoomDisplay>
        </main>
      </GalleryProvider>
    </ZoomAndPanProvider>
  )
}