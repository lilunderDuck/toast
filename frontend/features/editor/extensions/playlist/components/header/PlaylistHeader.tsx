import { Show } from "solid-js"
import { macro_getValueOrDefault, macro_mergeClassnames } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./PlaylistHeader.module.css"
// ...
import { createLazyLoadedDialog, Spacer } from "~/components"
// ...
import { usePlaylistContext } from "../../provider"
import { PlaylistHeaderButtonRow, type IPlaylistHeaderButtonRowProps } from "./PlaylistHeaderButtonRow"
import PlaylistHeaderIcon from "./PlaylistHeaderIcon"

const style = stylex.create({
  header: {
    paddingInline: 15,
    paddingBlock: 10,
    display: "flex",
    gap: 15
  },
  header__infoWrap: {
    width: "100%"
  },
  header__info: {
    display: "flex",
    alignItems: "center",
    width: "100%"
  }
})

export function PlaylistHeader() {
  const { data$, trackItems$ } = usePlaylistContext()
  const PlaylistEditMetadataDialog = createLazyLoadedDialog(
    () => import("../dialog/PlaylistEditMetadataDialog"),
    () => ({
      prevData$: data$()!,
      context$: usePlaylistContext()
    })
  )

  const PlaylistCreateTrackDialog = createLazyLoadedDialog(
    () => import("../dialog/PlaylistCreateTrackDialog"),
    () => ({
      context$: usePlaylistContext(),
    })
  )

  const buttonRowClicked: IPlaylistHeaderButtonRowProps["onClick$"] = (action) => {
    switch (action) {
      case "add_track_item$": return PlaylistCreateTrackDialog.show$()
      case "edit_metadata$": return PlaylistEditMetadataDialog.show$()
    }
  }

  return (
    <header class={macro_mergeClassnames(stylex.attrs(style.header), __style.header)}>
      <PlaylistHeaderIcon icon$={data$()?.icon} />
      <div {...stylex.attrs(style.header__infoWrap)}>
        <h2>
          {macro_getValueOrDefault(data$()?.title, "", "Unnamed playlist")}
        </h2>
        <Show when={data$()?.description || data$()?.description === ""}>
          <p>{data$()!.description}</p>
        </Show>
        <div {...stylex.attrs(style.header__info)}>
          <span>
            {trackItems$.items$().length} track
          </span>
          <Spacer />
          <PlaylistHeaderButtonRow onClick$={buttonRowClicked} />
        </div>
      </div>

      <PlaylistEditMetadataDialog.Dialog$ />
      <PlaylistCreateTrackDialog.Dialog$ />
    </header>
  )
}