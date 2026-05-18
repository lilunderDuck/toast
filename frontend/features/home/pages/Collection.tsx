import stylex from "@stylexjs/stylex"
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { CleanupPlaylists, GetAllPlaylistsData, InitPlaylists } from "~/wailsjs/go/playlist/Exports";
import { CollectionLabel, CollectionItem, CollectionItemsSkeleton } from "../components";
import type { playlist } from "~/wailsjs/go/models";
import { RiMediaGalleryFill, RiMediaPlayList2Fill } from "solid-icons/ri";
import { playlistIconUrl } from "~/features/playlist/api";

interface ICollections {
  playlist$: playlist.PlaylistData[]
}

const style = stylex.create({
  collection: {
    width: "100%",
    height: '100%',
    userSelect: "none"
  },
  collection__list: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    minHeight: "10rem"
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
      <CollectionLabel>
        <RiMediaPlayList2Fill />
        Playlist
      </CollectionLabel>
      <div {...stylex.attrs(style.collection__list)}>
        <Show when={collections()} fallback={
          <CollectionItemsSkeleton />
        }>
          <For each={collections()?.playlist$ ?? []}>
            {it => (
              <CollectionItem 
                href$={`/collection/playlist/${it.id}`}
                iconUrl$={playlistIconUrl(it.id, it.icon ?? "")}
                name$={it.name}
                tooltipLabel$={it.name}
              />
            )}
          </For>
        </Show>
      </div>

      <CollectionLabel>
        <RiMediaGalleryFill />
        Gallery
      </CollectionLabel>
      <div {...stylex.attrs(style.collection__list)}>
        <Show when={collections()} fallback={
          <CollectionItemsSkeleton />
        }>
          
        </Show>
      </div>
    </main>
  )
}