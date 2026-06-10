import { Show } from "solid-js"
import { getExternalGalleryEntryUrl, getGalleryEntryUrl } from "../api"
import { useGalleryContext } from "../provider"
import { css } from "molcss"

const item__image = css`
  height: 100%;
  width: auto !important;
  max-width: 100%;
  object-fit: contain;
`

export function GalleryItemDisplay() {
  const { currentItem$, isExternal$, directory$ } = useGalleryContext()

  const itemUrl = () => isExternal$ ? 
    getExternalGalleryEntryUrl(directory$!, currentItem$()!.fileName) : 
    getGalleryEntryUrl(currentItem$()!.fileName)
  // ...

  return (
    <Show when={currentItem$()}>
      <img 
        src={itemUrl()} 
        class={item__image}
        draggable={false}
      />
    </Show>
  )
}