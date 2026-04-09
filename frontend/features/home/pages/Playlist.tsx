import { AppTitleBarDraggable } from "~/components";

import stylex from "@stylexjs/stylex"
import { createResource, For } from "solid-js";
import { GetAllPlaylistsData } from "~/wailsjs/go/playlist/Exports";
import { PlaylistItem } from "../components";

const style = stylex.create({
  playlist: {
    width: "100%",
    height: '100%',
    padding: 5,
    userSelect: "none"
  }
})

export default function Playlist() {
  const [resource] = createResource(() => GetAllPlaylistsData())
  
  return (
    <main {...stylex.attrs(style.playlist)}>
      <h1>Playlist</h1>
      <For each={resource() ?? []}>
        {it => (
          <PlaylistItem {...it} />
        )}
      </For>
    </main>
  )
}