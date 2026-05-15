import stylex from "@stylexjs/stylex"
import { usePlaylistContext } from "../provider"
import { For } from "solid-js"
import { PlaylistItem } from "../components"

const style = stylex.create({
  itemList: {
    paddingBottom: "10rem",
  }
})

interface IPlaylistItemListProps {
  // define your component props here
}

export function PlaylistItemList(props: IPlaylistItemListProps) {
  const { tracks$, loopingState$ } = usePlaylistContext()
  
  return (
    <div 
      {...stylex.attrs(style.itemList)} 
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