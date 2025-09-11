import { Show } from "solid-js"
import { BsMusicNote } from "solid-icons/bs"
import { macro_getValueOrDefault } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { usePlaylistContext } from "../provider"
// ...
import { createLazyLoadedDialog } from "~/components"
import { ASSETS_SERVER_URL, escapeCssUrl } from "~/api"

const style = stylex.create({
  header: {
    paddingInline: 15,
    paddingBlock: 10,
    display: "flex",
    gap: 15
  },
  header__icon: {
    width: "7rem",
    height: "7rem",
    borderRadius: 6,
    background: "center center no-repeat var(--icon-url)",
  },
  header__iconEmpty: {
    width: "7rem",
    height: "7rem",
    borderRadius: 6,
    backgroundColor: "var(--gray5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})

export function PlaylistHeader() {
  const { data$ } = usePlaylistContext()
  const PlaylistEditMetadataDialog = createLazyLoadedDialog(
    () => import("./dialog/PlaylistEditMetadataDialog"),
    () => ({
      prevData$: data$()!,
      context$: usePlaylistContext()
    })
  )

  return (
    <header {...stylex.attrs(style.header)}>
      <Show when={data$()?.icon} fallback={
        <div {...stylex.attrs(style.header__iconEmpty)}>
          <BsMusicNote size={40} />
        </div>
      }>
        <div {...stylex.attrs(style.header__icon)} style={{
          "--icon-url": escapeCssUrl(`${ASSETS_SERVER_URL}/local-assets/playlist/icon/${data$()?.icon}`)
        }} />
      </Show>
      <div onClick={PlaylistEditMetadataDialog.show$}>
        <h2>
          {macro_getValueOrDefault(data$()?.title, "", "Unnamed playlist")}
        </h2>
        <Show when={data$()?.description || data$()?.description === ""}>
          <p>{data$()!.description}</p>
        </Show>
      </div>

      <PlaylistEditMetadataDialog.Dialog$ />
    </header>
  )
}