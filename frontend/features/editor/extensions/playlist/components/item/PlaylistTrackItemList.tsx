import { createSignal, For } from "solid-js"
// @ts-ignore - used as a directive
import { dndzone } from "solid-dnd-directive"
// ...
import stylex from "@stylexjs/stylex"
// ...
import type { IDndConsiderEvent, IDndFinalizeEvent } from "~/features/journal"
import type { editor } from "~/wailsjs/go/models"
import { arrayObjects } from "~/utils"
// ...
import { usePlaylistContext } from "../../provider"
import PlaylistTrackItem from "./PlaylistTrackItem"

const style = stylex.create({
  node: {
    width: "100%",
    height: "30rem",
    backgroundColor: "var(--gray3)",
    borderRadius: 6,
    overflowY: "auto"
  },
  node__trackItem: {
    paddingLeft: 0,
    outline: "none"
  }
})

export function PlaylistTrackItemList() {
  const { data$, editPlaylist$ } = usePlaylistContext()
  const [items, setItems] = createSignal<editor.PlaylistItemData[]>(data$()!.items)

  // yes, long confusing type surely won't confuse me later
  const considerDragging: EventHandler<"ul", "on:consider"> = (dragEvent) => {
    const { items: newItems } = (dragEvent as unknown as IDndConsiderEvent<editor.PlaylistItemData>).detail
    setItems(newItems)
  }

  const finalizeDragging: EventHandler<"ul", "on:finalize"> = (dragEvent) => {
    const { items: newItems } = (dragEvent as unknown as IDndFinalizeEvent<editor.PlaylistItemData>).detail
    setItems(newItems)
    editPlaylist$({ items: newItems } as editor.PlaylistOptions)
  }

  const deleteTrack = (trackId: number) => {
    setItems(prev => [...arrayObjects(prev).remove$('id', trackId)])
    editPlaylist$({ items: items() } as editor.PlaylistOptions)
  }

  return (
    <ul
      {...stylex.attrs(style.node__trackItem)}
      use:dndzone={{
        items,
        type: "internal_playlist_item$",
        dropTargetStyle: {
          outline: 'none'
        }
      }}
      on:consider={considerDragging}
      on:finalize={finalizeDragging}
    >
      <For each={items()}>
        {(it, index) => (
          <PlaylistTrackItem
            {...it}
            index$={index()}
            onDelete$={() => deleteTrack(it.id)}
          />
        )}
      </For>
    </ul>
  )
}