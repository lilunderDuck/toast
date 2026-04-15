import stylex from "@stylexjs/stylex"
import { usePlaylistContext } from "../provider"
import { For } from "solid-js"
import { PlaylistItem } from "../components"

const style = stylex.create({
  itemList: {
    height: "calc(100vh - 23.25rem)",
    paddingBottom: "5rem",
    paddingRight: 10,
  }
})

interface IPlaylistItemListProps {
  // define your component props here
}

export function PlaylistItemList(props: IPlaylistItemListProps) {
  const { tracks$ } = usePlaylistContext()
  
  return (
    <div class={`${stylex.attrs(style.itemList).class} scrollbar scrollbarVertical`}>
      <For each={tracks$()}>
        {(it, index) => (
          <PlaylistItem {...it} index$={index()} />
        )}
      </For>
    </div>
  )
}