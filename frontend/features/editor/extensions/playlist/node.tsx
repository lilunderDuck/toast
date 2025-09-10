import stylex from "@stylexjs/stylex"
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"
import { usePlaylistContext } from "./provider"
import { Show } from "solid-js"

const style = stylex.create({
  node: {
    width: "100%",
    height: "30rem"
  }
})

export default function PlaylistNode() {
  const { isEmpty$ } = usePlaylistContext()

  return (
    <NodeViewWrapper {...stylex.attrs(style.node)}>
      <Show when={isEmpty$()}>
        <div></div>
      </Show>
    </NodeViewWrapper>
  )
}