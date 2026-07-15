import { Match, Show, Switch } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { ZoomDisplay } from "~/components"
// ...
import { getExternalGalleryEntryUrl, getGalleryEntryUrl } from "../api"
import { useGalleryContext } from "../provider"
import { Video } from "../components"

const item__image = css`
  height: 100%;
  width: auto !important;
  max-width: 100%;
  object-fit: contain;
`

const item__video = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`

export function GalleryItemDisplay() {
  const { currentItem$, isExternal$, directory$ } = useGalleryContext()

  const itemUrl = (pathToItem: string) => isExternal$ ? 
    getExternalGalleryEntryUrl(directory$!, pathToItem) : 
    getGalleryEntryUrl(pathToItem)
  // ...

  return (
    <Show when={currentItem$()}>
      <Switch>
        <Match when={currentItem$()?.type === 0}>
          <ZoomDisplay>
            <img 
              src={itemUrl(currentItem$()!.fileName)} 
              class={item__image}
              draggable={false}
            />
          </ZoomDisplay>
        </Match>

        <Match when={currentItem$()?.type === 1}>
          <div class={item__video}>
            <Video 
              src$={itemUrl(currentItem$()!.fileName)} 
              subtitleUrlRoot$={itemUrl('')} 
              subtitles$={currentItem$()?.subtitles ?? []}
              enableKeyboardShotcuts$={true}
            />
          </div>
        </Match>
      </Switch>
    </Show>
  )
}