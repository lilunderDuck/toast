import { Show } from "solid-js"
import { GET_VALUE_OR_DEFAULT, MERGE_CLASS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./PlaylistHeader.module.css"
// ...
import { Spacer } from "~/components"
import { createLazyLoadedDialog } from "~/hooks"
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
  const { data$, items$ } = usePlaylistContext()
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

  const buttonRowClicked: IPlaylistHeaderButtonRowProps["action$"] = (action) => {
    switch (action) {
      case PlaylistHeaderButtonRowAction.ADD_TRACK_ITEM: return PlaylistCreateTrackDialog.show$()
      case PlaylistHeaderButtonRowAction.EDIT_METADATA: return PlaylistEditMetadataDialog.show$()
    }
  }

  return (
    <header class={MERGE_CLASS(stylex.attrs(style.header), __style.header)}>
      <PlaylistHeaderIcon icon$={data$()?.icon} />
      <div {...stylex.attrs(style.header__infoWrap)}>
        <h2>
          {GET_VALUE_OR_DEFAULT(data$()?.title, "", "Unnamed playlist")}
        </h2>
        <Show when={data$()?.description || data$()?.description === ""}>
          <p>{data$()!.description}</p>
        </Show>
        <div {...stylex.attrs(style.header__info)}>
          <span>
            {items$.items$().length} track
          </span>
          <Spacer />
          <PlaylistHeaderButtonRow action$={buttonRowClicked} />
        </div>
      </div>

      <PlaylistEditMetadataDialog.Dialog$ />
      <PlaylistCreateTrackDialog.Dialog$ />
    </header>
  )
}