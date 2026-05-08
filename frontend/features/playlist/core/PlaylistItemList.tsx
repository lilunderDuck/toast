import stylex from "@stylexjs/stylex"
import { usePlaylistContext } from "../provider"
import { For } from "solid-js"
import { PlaylistItem } from "../components"

const style = stylex.create({
  itemList: {
    paddingBottom: "10rem",
    paddingRight: 20,
  }
})

interface IPlaylistItemListProps {
  // define your component props here
}

export function PlaylistItemList(props: IPlaylistItemListProps) {
  const { tracks$ } = usePlaylistContext()
  
  return (
    <div {...stylex.attrs(style.itemList)}>
      <For each={tracks$()}>
        {(it, index) => (
          <PlaylistItem {...it} index$={index()} />
        )}
      </For>
    </div>
  )
}