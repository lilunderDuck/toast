import { css } from "molcss"
// ...
import { useGalleryContext } from "../provider"
import { Show } from "solid-js"

const item__currentItemName = css`
  position: absolute;
  bottom: 0;
  left: 0;
  padding-inline: 10px;
  padding-block: 5px;
  border-top-right-radius: 6px;
  background-color: var(--mantle);
  width: fit-content;
  z-index: 5;
  font-size: 13px;
  user-select: none;
`

export function GalleryCurrentItem() {
  const { currentItem$, allControlsHidden$ } = useGalleryContext()

  return (
    <Show when={!allControlsHidden$()}>
      <Show when={currentItem$()}>
        <div class={item__currentItemName}>
          {currentItem$()?.fileName}
        </div>
      </Show>
    </Show>
  )
}