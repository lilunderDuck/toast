import "../components/PlaylistItem.css"
import "~/styles/shorthand.css"
import { css } from "molcss"
// ...
import { Divider } from "~/components"

const header = css`
  padding-inline: 20px;
  padding-block: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  border-bottom: 1px solid var(--overlay1);
  margin-bottom: 10px;
  user-select: none;
`

export function PlaylistItemListHeader() {
  return (
    <header class={`${header} showOnHover`}>
      <div class="playlist__trackIndex">
        #
      </div>
      <div class="playlist__trackIcon" />
      <Divider variant$={DividerVariant.VERTICAL} class="showOnHover__hide" />
      <div class="playlist__trackName">
        Name
      </div>
      <Divider variant$={DividerVariant.VERTICAL} class="showOnHover__hide" />
      <div class="playlist__trackArtist">
        Artist
      </div>
      <Divider variant$={DividerVariant.VERTICAL} class="showOnHover__hide" />
      <div class="playlist__trackDuration">
        Duration
      </div>
    </header>
  )
}