import { Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"
import { usePlaylistContext } from "./provider"
import { PlaylistHeader } from "./components"

const style = stylex.create({
  node: {
    width: "100%",
    height: "30rem"
  }
})

export default function PlaylistNode() {
  const { data$ } = usePlaylistContext()

  return (
    <NodeViewWrapper {...stylex.attrs(style.node)}>
      <Show when={data$()}>
        <PlaylistHeader />
      </Show>
    </NodeViewWrapper>
  )
}