import { A, useParams } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import "~/styles/scrollbar.css"
import "./[playlistId].css"
// ...
import { AppTitleBarDraggable, Button, Tooltip } from "~/components"
import { PlaylistHeader, PlaylistItemList, PlaylistItemListHeader, PlaylistProvider, PlaylistTrackPlayer } from "~/features/playlist"
import { BsArrowLeft } from "solid-icons/bs"
import { CLS } from "macro-def"

const style = stylex.create({
  page: {
    width: "100%",
    height: "100%",
  },
  page__titleBar: {
    paddingInline: 5,
    position: "fixed"
  }
})

export default function PlaylistPage() {
  const param = useParams()

  return (
    <PlaylistProvider playlistId$={parseInt(param.playlistId!)}>
      <AppTitleBarDraggable {...stylex.attrs(style.page__titleBar)}>
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
        class={`${CLS(style.page)} scrollbar scrollbarVertical`}
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