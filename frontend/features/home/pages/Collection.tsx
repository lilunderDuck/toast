import stylex from "@stylexjs/stylex"
import { createResource, For } from "solid-js";
import { GetAllPlaylistsData } from "~/wailsjs/go/playlist/Exports";
import { CollectionDivider, CollectionItem } from "../components";

const style = stylex.create({
  collection: {
    width: "100%",
    height: '100%',
    padding: 5,
    userSelect: "none"
  },
  collection__dividerWrap: {
    width: "100%",
  }
})

export default function Collection() {
  const [resource] = createResource(() => GetAllPlaylistsData())
  
  return (
    <main {...stylex.attrs(style.collection)}>
      <h1>Collection</h1>
      <CollectionDivider>
        Playlist
      </CollectionDivider>
      <For each={resource() ?? []}>
        {it => (
          <CollectionItem {...it} />
        )}
      </For>
    </main>
  )
}