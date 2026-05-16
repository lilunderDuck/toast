import stylex from "@stylexjs/stylex"
import { createSignal, For, onCleanup, onMount } from "solid-js";
import { CleanupPlaylists, GetAllPlaylistsData, InitPlaylists } from "~/wailsjs/go/playlist/Exports";
import { CollectionDivider, PlaylistCollectionItem } from "../components";
import type { playlist } from "~/wailsjs/go/models";
import { RiMediaGalleryFill, RiMediaPlayList2Fill } from "solid-icons/ri";

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
    <main {...stylex.attrs(style.collection)} id="journalHome__mainContent">
      <h1>Collection</h1>
      <CollectionDivider>
        <RiMediaPlayList2Fill />
        Playlist
      </CollectionDivider>
      <div {...stylex.attrs(style.collection__list)}>
        <For each={collections()?.playlist$ ?? []}>
          {it => <PlaylistCollectionItem {...it} />}
        </For>
      </div>
      <CollectionDivider>
        <RiMediaGalleryFill />
        Gallery
      </CollectionDivider>
    </main>
  )
}