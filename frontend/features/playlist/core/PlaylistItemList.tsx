import { For } from "solid-js"
// @ts-ignore - used as a directive
import { dndzone } from "solid-dnd-directive"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { usePlaylistContext } from "../provider"
import { PlaylistItem } from "../components"

const style = stylex.create({
  itemList: {
    paddingBottom: "10rem",
  }
})

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
      {...stylex.attrs(style.itemList)} 
      use:dndzone={{
        items: tracks$,
        type: "playlist_track$",
        dropTargetStyle: {
          outline: 'none'
        }
      }}
      on:consider={considerDragging}
      on:finalize={finalizeDragging}
      data-loop-current={loopingState$() === PlaylistLoopState.REPEAT_ONCE}
    >
      <For each={tracks$()}>
        {(it, index) => (
          <PlaylistItem {...it} index$={index()} />
        )}
      </For>
    </div>
  )
}