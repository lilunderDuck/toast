import { Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"
// ...
import { usePlaylistContext } from "./provider"
import { PlaylistAudioPlayer, PlaylistHeader, PlaylistTrackItemHeader, PlaylistTrackItemList } from "./components"

const style = stylex.create({
  node: {
    width: "100%",
    height: "30rem",
    backgroundColor: "var(--gray3)",
    borderRadius: 6,
    overflowY: "auto",
    position: "relative"
  },
  node__trackItem: {
    paddingLeft: 0,
    outline: "none"
  }
})

export default function PlaylistNodeView() {
  const { attrs$ } = usePlaylistContext()

  return (
    <NodeViewWrapper {...stylex.attrs(style.node)}>
      <Show when={attrs$()}>
        <PlaylistHeader />
        <PlaylistTrackItemHeader />
        <PlaylistTrackItemList />
        <PlaylistAudioPlayer />
      </Show>
    </NodeViewWrapper>
  )
}