import { useParams, useSearchParams } from "@solidjs/router";
// ...
import { css } from "molcss";
import "./[galleryId].css"
// ...
import { ZoomAndPanProvider } from "~/components";
import { GalleryItemDisplay, GalleryNav, GalleryProvider } from "~/features/gallery";

const gallery__page = css`
  width: 100%;
  height: 100%;
  position: relative;
`

export default function GalleryPage() {
  const param = useParams()
  const [searchParam] = useSearchParams<{ directory?: string }>()

  return (
    <ZoomAndPanProvider>
      <GalleryProvider
        galleryId$={param.galleryId as string}
        directory$={searchParam.directory}
      >
        <main class={gallery__page}>
          <GalleryNav />
          <GalleryItemDisplay />
        </main>
      </GalleryProvider>
    </ZoomAndPanProvider>
  )
}