import { A, useParams } from "@solidjs/router"
import { BsArrowLeft } from "solid-icons/bs"
// ...
import "./[playlistId].css"
import { css } from "molcss"
// ...
import { AppTitleBarDraggable, Button, Tooltip } from "~/components"
import { PlaylistHeader, PlaylistItemList, PlaylistItemListHeader, PlaylistProvider, PlaylistTrackPlayer } from "~/features/playlist"
import { scrollbar, scrollbar__invs, scrollbar__vertical } from "~/styles"

const page = css`
  width: 100%;
  height: 100%;
`

const page__titleBar = css`
  padding-inline: 5px;
  position: fixed;
`

export default function PlaylistPage() {
  const param = useParams()

  return (
    <PlaylistProvider playlistId$={param.playlistId!}>
      <AppTitleBarDraggable class={page__titleBar}>
        <A href="/">
          <Tooltip label$="Go back to home">
            <Button
              size$={ButtonSize.ICON}
              variant$={ButtonVariant.NO_BACKGROUND}
            >
              <BsArrowLeft />
            </Button>
          </Tooltip>
        </A>
      </AppTitleBarDraggable>
      <div 
        class={`${page} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}
        id="playlist__page"
      >
        <PlaylistHeader />
        <PlaylistItemListHeader />
        <PlaylistItemList />
      </div>
      <PlaylistTrackPlayer />
    </PlaylistProvider>
  )
}