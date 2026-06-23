import { Match, Show, Switch } from "solid-js"
import { getExternalGalleryEntryUrl, getGalleryEntryUrl } from "../api"
import { useGalleryContext } from "../provider"
import { css } from "molcss"
import { Video, ZoomDisplay } from "~/components"

const item__image = css`
  height: 100%;
  width: auto !important;
  max-width: 100%;
  object-fit: contain;
`

const item__video = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(0);
  width: 100%;
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