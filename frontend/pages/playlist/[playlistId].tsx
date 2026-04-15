import { useParams } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import "~/styles/scrollbar.css"
// ...
import { AppTitleBarDraggable, Button } from "~/components"
import { PlaylistHeader, PlaylistItemList, PlaylistItemListHeader, PlaylistProvider, PlaylistTrackPlayer } from "~/features/playlist"

const style = stylex.create({
  page: {
    width: "100%",
    padding: 10
  }
})

export default function PlaylistPage() {
  const param = useParams()

  return (
    <PlaylistProvider playlistId$={parseInt(param.playlistId!)}>
      <AppTitleBarDraggable>
        <Button
          size$={ButtonSize.ICON}
          variant$={ButtonVariant.NO_BACKGROUND}
        >
        </Button>
      </AppTitleBarDraggable>
      <div {...stylex.attrs(style.page)}>
        <PlaylistHeader />
        <PlaylistItemListHeader />
        <PlaylistItemList />
      </div>
      <PlaylistTrackPlayer />
    </PlaylistProvider>
  )
}