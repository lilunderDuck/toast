import { For } from "solid-js"
// @ts-ignore - used as a directive
import { dndzone } from "solid-dnd-directive"
// ...
import { css } from "molcss"
// ...
import { usePlaylistContext } from "../provider"
import { PlaylistItem } from "../components"

const itemList = css`
  padding-bottom: 10rem;
`

export function PlaylistItemList() {
  const { tracks$, loopingState$, _setTracks$, saveTrackData$ } = usePlaylistContext()

  const considerDragging: EventHandler<"div", "on:consider"> = (dragEvent) => {
    _setTracks$(dragEvent.detail.items as any[])
  }

  const finalizeDragging: EventHandler<"div", "on:finalize"> = (dragEvent) => {
    _setTracks$(dragEvent.detail.items as any[])
    saveTrackData$()
  }
  
  return (
    <div 
      class={`${itemList} ${loopingState$() === PlaylistLoopState.REPEAT_ONCE ? "playlist__currentlyLoopingOneTrack" : ""}`}
      use:dndzone={{
        items: tracks$,
        type: "playlist_track$",
        dropTargetStyle: {
          outline: 'none'
        }
      }}
      on:consider={considerDragging}
      on:finalize={finalizeDragging}
    >
      <For each={tracks$()}>
        {(it, index) => (
          <PlaylistItem {...it} index$={index()} />
        )}
      </For>
    </div>
  )
}