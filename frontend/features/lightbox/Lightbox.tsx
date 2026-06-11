import { createSignal, Show } from "solid-js"
// ...
import { css } from "molcss"
import "~/styles/animation.css"
// ...
import { ASSETS_SERVER_URL } from "~/api"
import { AppTitleBarDraggable } from "~/components"
import { useDocumentEventListener } from "~/hooks"
import { sleep } from "~/utils"

const lightbox__root = css`
  width: 100%;
  height: 100%;
  position: absolute;
  background: center center no-repeat var(--lightbox-background-url);
  background-size: cover;
  top: 0;
`

const lightbox__fadeIn = css`
  animation: animation_fadeAndZoomIn 0.2s ease-out forwards;
`

const lightbox__fadeOut = css`
  animation: animation_fadeOut 0.2s ease-out forwards;
`

export function Lightbox() {
  const [showLightbox, setShowLightbox] = createSignal(false)
  const [shouldFadeOut, setShouldFadeOut] = createSignal(false)

  useDocumentEventListener("keydown", (keyboardEvent) => {
    if (keyboardEvent.key.toLowerCase() !== "f") return

    if (showLightbox()) {
      setShouldFadeOut(true)
      sleep(0.2 * 1000 + 100).then(() => setShowLightbox(false))
    } else {
      setShouldFadeOut(false)
      setShowLightbox(true)
    }
  })

  return (
    <Show when={showLightbox()}>
      <div 
        class={`${lightbox__root} ${shouldFadeOut() ? lightbox__fadeOut : lightbox__fadeIn}`}
        style={`--lightbox-background-url:url('${`${ASSETS_SERVER_URL}/local-assets/data/lightboxes/Sanctuary in the grove.gif`}')`}
      >
        <AppTitleBarDraggable />
      </div>
    </Show>
  )
}