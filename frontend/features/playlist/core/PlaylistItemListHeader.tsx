import stylex from "@stylexjs/stylex"
import "../components/PlaylistItem.css"
import "~/styles/shorthand.css" // explicit import
import { PlaylistItemListHeaderSeperator } from "../components"

const style = stylex.create({
  header: {
    paddingInline: 10,
    paddingBlock: 5,
    display: "flex",
    alignItems: "center",
    gap: 5,
    borderBottom: "1px solid var(--overlay1)",
    marginBottom: 10,
    userSelect: "none"
  }
})

export function PlaylistItemListHeader() {
  return (
    <header class={`${stylex.attrs(style.header).class} showOnHover`}>
      <div id="item__index">
        #
      </div>
      <div id="item__icon" />
      <PlaylistItemListHeaderSeperator class="showOnHover__hide" />
      <div id="item__name">
        Name
      </div>
      <PlaylistItemListHeaderSeperator class="showOnHover__hide" />
      <div id="item__artist">
        Artist
      </div>
      <PlaylistItemListHeaderSeperator class="showOnHover__hide" />
      <div id="item__duration">
        Duration
      </div>
    </header>
  )
}