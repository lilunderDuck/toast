import { useParams } from "@solidjs/router"
import stylex from "@stylexjs/stylex"
import { AppTitleBarDraggable } from "~/components"
import { PlaylistHeader, PlaylistProvider } from "~/features/playlist"

const style = stylex.create({
  page: {
    width: "100%",
    height: "100%",
    padding: 10
  }
})

export default function PlaylistPage() {
  const param = useParams()

  return (
    <PlaylistProvider playlistId$={parseInt(param.playlistId!)}>
      <AppTitleBarDraggable />
      <div {...stylex.attrs(style.page)}>
        <PlaylistHeader />
      </div>
    </PlaylistProvider>
  )
}