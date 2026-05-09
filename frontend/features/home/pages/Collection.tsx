import stylex from "@stylexjs/stylex"
import { createResource, createSignal, For, onCleanup, onMount } from "solid-js";
import { CleanupPlaylists, GetAllPlaylistsData, InitPlaylists } from "~/wailsjs/go/playlist/Exports";
import { CollectionDivider, CollectionItem, PlaylistCollectionItem } from "../components";
import type { playlist } from "~/wailsjs/go/models";

interface ICollections {
  playlist$: playlist.PlaylistData[]
}

const style = stylex.create({
  collection: {
    width: "100%",
    height: '100%',
    padding: 5,
    userSelect: "none"
  },
  collection__list: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10
  }
})

export default function Collection() {
  const [collections, setCollections] = createSignal<ICollections | null>(null)
  onMount(async() => {
    await InitPlaylists()
    setCollections({
      playlist$: await GetAllPlaylistsData()
    })
  })

  onCleanup(CleanupPlaylists)
  
  return (
    <main {...stylex.attrs(style.collection)}>
      <h1>Collection</h1>
      <CollectionDivider>
        Playlist
      </CollectionDivider>
      <div {...stylex.attrs(style.collection__list)}>
        <For each={collections()?.playlist$ ?? []}>
          {it => <PlaylistCollectionItem {...it} />}
        </For>
      </div>
    </main>
  )
}